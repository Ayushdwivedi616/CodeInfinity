import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import AsyncSessionLocal, engine
from app.models import Base, User
from app.auth import get_password_hash


async def seed():
    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:  # type: AsyncSession
        # Admin
        admin_email = 'admin@abc.com'
        admin_password = 'AdminPass123!'
        q = await session.execute(select(User).where(User.email == admin_email))
        admin = q.scalar_one_or_none()
        if not admin:
            hashed = await get_password_hash(admin_password)
            admin = User(name='Admin', email=admin_email, password_hash=hashed, role='admin')
            session.add(admin)
            await session.commit()
            print('Created admin user:', admin_email)
        else:
            print('Admin user already exists:', admin_email)

        # Candidate
        cand_email = 'user@abc.com'
        cand_password = 'CandidatePass123!'
        q = await session.execute(select(User).where(User.email == cand_email))
        cand = q.scalar_one_or_none()
        if not cand:
            hashed = await get_password_hash(cand_password)
            cand = User(name='Candidate', email=cand_email, password_hash=hashed, role='candidate')
            session.add(cand)
            await session.commit()
            print('Created candidate user:', cand_email)
        else:
            print('Candidate user already exists:', cand_email)


if __name__ == '__main__':
    asyncio.run(seed())
