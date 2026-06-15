from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from .db import get_db
from .auth import get_current_active_user

CurrentSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[object, Depends(get_current_active_user)]
