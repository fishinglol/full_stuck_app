# app/google_pay_payments.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Dict, Optional, List
import json
import hashlib
import hmac
import base64
import logging
from datetime import datetime

from .database import get_db
from . import models

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])

# Pydantic models for Google Pay
class PaymentMethodData(BaseModel):
    type: str
    description: str
    info: Dict

class PaymentData(BaseModel):
    apiVersionMinor: int
    apiVersion: int
    paymentMethodData: PaymentMethodData

class PaymentRequest(BaseModel):
    payment_data: PaymentData
    amount: float
    currency: str = "USD"
    order_id: str
    user_id: int
    description: Optional[str] = None

class PaymentResponse(BaseModel):
    success: bool
    transaction_id: str
    status: str
    message: str
    amount: float
    currency: str

class GooglePayService:
    def __init__(self, merchant_id: str, merchant_name: str, gateway_merchant_id: str = None):
        self.merchant_id = merchant_id
        self.merchant_name = merchant_name
        self.gateway_merchant_id = gateway_merchant_id or merchant_id
        
    def create_payment_request(self, amount: float, currency: str = "USD") -> Dict:
        """
        Create a Google Pay payment request configuration
        This returns the client-side configuration for Google Pay
        """
        return {
            "apiVersion": 2,
            "apiVersionMinor": 0,
            "allowedPaymentMethods": [
                {
                    "type": "CARD",
                    "parameters": {
                        "allowedAuthMethods": ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                        "allowedCardNetworks": ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"]
                    },
                    "tokenizationSpecification": {
                        "type": "PAYMENT_GATEWAY",
                        "parameters": {
                            "gateway": "example",  # Replace with your payment gateway
                            "gatewayMerchantId": self.gateway_merchant_id
                        }
                    }
                }
            ],
            "merchantInfo": {
                "merchantId": self.merchant_id,
                "merchantName": self.merchant_name
            },
            "transactionInfo": {
                "totalPriceStatus": "FINAL",
                "totalPriceLabel": "Total",
                "totalPrice": str(amount),
                "currencyCode": currency,
                "countryCode": "US"
            }
        }
    
    def verify_payment_token(self, payment_token: str) -> bool:
        """
        Verify the payment token from Google Pay
        In production, you would decrypt and validate the token
        """
        try:
            # This is a simplified verification
            # In production, you need to:
            # 1. Verify the signature
            # 2. Decrypt the payment data
            # 3. Validate with your payment processor
            
            token_data = json.loads(base64.b64decode(payment_token))
            return "signature" in token_data and "protocolVersion" in token_data
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return False

# Initialize the service (you'll need to set these values)
google_pay_service = GooglePayService(
    merchant_id="your_merchant_id_here",  # Get from Google Pay Console
    merchant_name="JINGJAI"
)

@router.get("/google-pay/config")
async def get_google_pay_config():
    """
    Get Google Pay configuration for frontend
    """
    try:
        config = google_pay_service.create_payment_request(
            amount=1.0,  # This will be dynamic based on the actual order
            currency="USD"
        )
        return {
            "success": True,
            "config": config
        }
    except Exception as e:
        logger.error(f"Failed to get Google Pay config: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate Google Pay configuration"
        )

@router.post("/google-pay/payment", response_model=PaymentResponse)
async def process_google_pay_payment(
    payment_request: PaymentRequest,
    db: Session = Depends(get_db)
):
    """
    Process a Google Pay payment
    """
    try:
        # Verify user exists
        user = db.query(models.User).filter(models.User.id == payment_request.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Extract payment token from Google Pay response
        payment_method_data = payment_request.payment_data.paymentMethodData
        
        # In a real implementation, you would:
        # 1. Decrypt the payment token
        # 2. Extract card details
        # 3. Process with your payment gateway (Stripe, Square, etc.)
        # 4. Handle 3DS authentication if required
        
        # For demo purposes, we'll simulate a successful payment
        transaction_id = f"txn_{payment_request.order_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Here you would typically integrate with your payment processor
        # payment_result = process_with_payment_gateway(payment_method_data, payment_request.amount)
        
        # Create payment record in database
        payment_record = models.Payment(
            user_id=payment_request.user_id,
            transaction_id=transaction_id,
            amount=payment_request.amount,
            currency=payment_request.currency,
            order_id=payment_request.order_id,
            payment_method="google_pay",
            status="completed",
            description=payment_request.description,
            created_at=datetime.utcnow()
        )
        
        db.add(payment_record)
        db.commit()
        
        logger.info(f"Google Pay payment processed: {transaction_id}")
        
        return PaymentResponse(
            success=True,
            transaction_id=transaction_id,
            status="completed",
            message="Payment processed successfully",
            amount=payment_request.amount,
            currency=payment_request.currency
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment processing failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Payment processing failed: {str(e)}"
        )

@router.get("/payment/{transaction_id}")
async def get_payment_status(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """
    Get payment status by transaction ID
    """
    try:
        payment = db.query(models.Payment).filter(
            models.Payment.transaction_id == transaction_id
        ).first()
        
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        return {
            "transaction_id": payment.transaction_id,
            "status": payment.status,
            "amount": payment.amount,
            "currency": payment.currency,
            "order_id": payment.order_id,
            "created_at": payment.created_at,
            "description": payment.description
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get payment status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve payment status"
        )

@router.post("/refund/{transaction_id}")
async def refund_payment(
    transaction_id: str,
    amount: Optional[float] = None,
    reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Refund a payment (partial or full)
    """
    try:
        payment = db.query(models.Payment).filter(
            models.Payment.transaction_id == transaction_id
        ).first()
        
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        if payment.status != "completed":
            raise HTTPException(
                status_code=400, 
                detail="Only completed payments can be refunded"
            )
        
        refund_amount = amount or payment.amount
        
        if refund_amount > payment.amount:
            raise HTTPException(
                status_code=400,
                detail="Refund amount cannot exceed original payment amount"
            )
        
        # Here you would process the refund with your payment gateway
        # refund_result = process_refund_with_gateway(transaction_id, refund_amount)
        
        # Create refund record
        refund_id = f"rfnd_{transaction_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        refund_record = models.Refund(
            payment_id=payment.id,
            refund_id=refund_id,
            amount=refund_amount,
            reason=reason,
            status="completed",
            created_at=datetime.utcnow()
        )
        
        db.add(refund_record)
        
        # Update payment status if fully refunded
        if refund_amount == payment.amount:
            payment.status = "refunded"
        else:
            payment.status = "partially_refunded"
        
        db.commit()
        
        return {
            "success": True,
            "refund_id": refund_id,
            "amount_refunded": refund_amount,
            "status": "completed",
            "message": "Refund processed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Refund processing failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Refund processing failed: {str(e)}"
        )