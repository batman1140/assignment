from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models, schemas
from typing import List

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_group(db: Session, group: schemas.GroupCreate):
    db_group = models.Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    # Add members to group
    for user_id in group.user_ids:
        db_member = models.GroupMember(group_id=db_group.id, user_id=user_id)
        db.add(db_member)
    db.commit()
    # Prepare response: fetch users for members
    users = db.query(models.User).filter(models.User.id.in_(group.user_ids)).all()
    return schemas.Group(
        id=db_group.id,
        name=db_group.name,
        created_at=db_group.created_at,
        members=[schemas.User.from_orm(user) for user in users]
    )

def get_group(db: Session, group_id: int):
    db_group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if db_group:
        # Get all user objects for members
        member_ids = [m.user_id for m in db.query(models.GroupMember).filter(models.GroupMember.group_id == db_group.id).all()]
        users = db.query(models.User).filter(models.User.id.in_(member_ids)).all()
        return schemas.Group(
            id=db_group.id,
            name=db_group.name,
            created_at=db_group.created_at,
            members=[schemas.User.from_orm(user) for user in users]
        )
    return None

def create_expense(db: Session, group_id: int, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(
        description=expense.description,
        amount=expense.amount,
        group_id=group_id,
        paid_by=expense.paid_by,
        split_type=expense.split_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    # Calculate splits
    if expense.split_type == schemas.SplitType.EQUAL:
        # Get group members
        members = db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).all()
        split_amount = expense.amount / len(members)
        
        for member in members:
            db_split = models.ExpenseSplit(
                expense_id=db_expense.id,
                user_id=member.user_id,
                amount=split_amount,
                percentage=100.0 / len(members)
            )
            db.add(db_split)
    else:  # PERCENTAGE
        for split in expense.splits:
            split_amount = (expense.amount * split.percentage) / 100
            db_split = models.ExpenseSplit(
                expense_id=db_expense.id,
                user_id=split.user_id,
                amount=split_amount,
                percentage=split.percentage
            )
            db.add(db_split)
    
    db.commit()
    return db_expense

def calculate_group_balances(db: Session, group_id: int):
    # Get all expenses for the group
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    
    balances = {}
    
    # Initialize balances for all group members
    members = db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).all()
    for member in members:
        user = db.query(models.User).filter(models.User.id == member.user_id).first()
        balances[member.user_id] = {
            'user_id': member.user_id,
            'user_name': user.name,
            'paid': 0.0,
            'owes': 0.0
        }
    
    # Calculate what each person paid and owes
    for expense in expenses:
        # Add to paid amount
        balances[expense.paid_by]['paid'] += expense.amount
        
        # Add to owed amounts
        for split in expense.splits:
            if split.user_id in balances:
                balances[split.user_id]['owes'] += split.amount
    
    # Calculate net balances
    result = []
    for user_id, balance in balances.items():
        net_balance = balance['paid'] - balance['owes']
        result.append(schemas.Balance(
            user_id=user_id,
            user_name=balance['user_name'],
            owes=balance['owes'],
            owed=balance['paid'],
            net_balance=net_balance
        ))
    
    return result