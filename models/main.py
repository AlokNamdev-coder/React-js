from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import joblib
import numpy as np

from pydantic import BaseModel,Field
from typing import List,Annotated




class Temperatutes(BaseModel):
    Name:Annotated[str,Field(...,description="Name of the State",examples=["Madhya Pradesh"])]
    temperatures:Annotated[List[float],Field(...,description=("Enter the last 30 days Temperature"),examples=[[10.0,23.5,41.7]])]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict_temp(data:Temperatutes):
    
    model=joblib.load(f"{data.Name}.pkl")
    result = model.predict(np.array(data.temperatures).reshape(1,-1))[0]
    return {"result":result}


