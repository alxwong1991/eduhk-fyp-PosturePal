from fastapi import APIRouter
from exercises.bicep_curls import BicepCurls

router = APIRouter()
bicep_curls = BicepCurls()

@router.get("/start_bicep_curls")
def start_bicep_curls():
    bicep_curls.timer.start()
    return {"message": "Bicep curls exercise started!"}