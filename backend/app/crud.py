from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date 
from app import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name = user.name, email = user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(models.Users).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(
        title = project.title,
        description = project.description,
        created_by = project.created_by
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session):
    return db.query(models.Project).all()


def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def delete_project(db: Session, project_id: int):
    project = get_project(db, project_id)
    if project:
        db.delete(project)
        db.commit()
    return project

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, project_id: int = None):
    query = db.query(models.Task)
    if project_id:
        query = query.filter(models.Task.project_id == project_id)
    return query.all()

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    task = get_task(db, task_id)
    if not task:
        return None
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    if task:
        db.delete(task)
        db.commit()
    return task

def get_dashboard_stats(db:Session):
    today = date.today()
    total = db.query(models.Task).count()
    completed = db.query(models.Task).filter(models.Task.status == models.TaskStatus.done).count()
    pending = db.query(models.Task).filter(models.Task.status != models.TaskStatus.done).count()
    overdue = db.query(models.Task).filter(models.Task.due_date < today, models.Task.status != models.TaskStatus.done).count()

    return{
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "overdue_tasks": overdue
    }