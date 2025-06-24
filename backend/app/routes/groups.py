from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    return crud.create_group(db=db, group=group)

@router.get("/groups/{group_id}", response_model=schemas.Group)
def read_group(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group

@router.get("/groups/{group_id}/balances", response_model=List[schemas.Balance])
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return crud.calculate_group_balances(db, group_id=group_id)

@router.post("/groups/{group_id}/expenses", response_model=schemas.Expense)
def create_expense_for_group(
    group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)
):
    return crud.create_expense(db=db, group_id=group_id, expense=expense)

@router.get("/groups", response_model=List[schemas.Group])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    groups = db.query(models.Group).offset(skip).limit(limit).all()
    result = []
    for group in groups:
        member_ids = [m.user_id for m in db.query(models.GroupMember).filter(models.GroupMember.group_id == group.id).all()]
        users = db.query(models.User).filter(models.User.id.in_(member_ids)).all()
        result.append(schemas.Group(
            id=group.id,
            name=group.name,
            created_at=group.created_at,
            members=[schemas.User.from_orm(user) for user in users]
        ))
    return result