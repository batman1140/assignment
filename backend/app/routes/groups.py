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