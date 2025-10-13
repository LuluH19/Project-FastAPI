from pydantic import BaseModel, EmailStr
from typing import Optional



class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True



class ContactBase(BaseModel):
    nom: str
    email: EmailStr
    telephone: str


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None


class Contact(ContactBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
