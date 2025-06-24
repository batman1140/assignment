from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SplitType(str, Enum):
    EQUAL = "equal"
    PERCENTAGE = "percentage"

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    user_ids: List[int]

class Group(GroupBase):
    id: int
    created_at: datetime
    members: List[User] = []
    
    class Config:
        from_attributes = True

class ExpenseSplitBase(BaseModel):
    user_id: int
    percentage: Optional[float] = None

class ExpenseSplitCreate(ExpenseSplitBase):
    pass

class ExpenseSplit(ExpenseSplitBase):
    id: int
    amount: float
    
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: SplitType

class ExpenseCreate(ExpenseBase):
    splits: List[ExpenseSplitCreate] = []

class Expense(ExpenseBase):
    id: int
    group_id: int
    created_at: datetime
    splits: List[ExpenseSplit] = []
    
    class Config:
        from_attributes = True

class Balance(BaseModel):
    user_id: int
    user_name: str
    owes: float
    owed: float
    net_balance: float