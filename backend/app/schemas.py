from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from app.models import TaskStatus

class UserCreate(BaseModel):
    name:str
    email: EmailStr

class UserResponse(BaseModel):
    id:int 
    name: str
    email: str

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    description :Optional[str] = None
    created_by: int

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_by: int

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    description : Optional[str]=None
    status: TaskStatus.todo
    due_date: Optional[date] = None
    project_id: int
    assigned_to: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str]=None
    description: Optional[str]=None
    status: Optional[TaskStatus]=None
    due_date: Optional[date] = None
    assigned_to: Optional[int] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    due_date: Optional[date]
    project_id: int
    assigned_to: Optional[int]

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int