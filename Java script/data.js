// ==================== COMPLETE LICIOUS WORKFLOW DATA - PART 1 ====================
// All SOPs, Scripts, Emails, and Workflows - Fully Optimized

const WorkflowData = {

  // ==================== ACCOUNT DETAILS ====================
  "Account Details": {
    subgroups: {
      "DND Activation": {
        script: "I understand you have a query regarding DND (Do Not Disturb) settings. Let me help you with that.",
        workflow: [
          "Listen to customer's DND requirement",
          "Identify if they want activation or deactivation",
          "Provide appropriate resolution"
        ],
        options: {
          "Activation": {
            script: "I apologize for the inconvenience. Please note that if we turn on DND from our side, you may not receive any OTP or SMS from us.",
            workflow: [
              "Apologize to customer",
              "Guide them about DND impact (no OTP/SMS)",
              "Ask if they want to proceed"
            ],
            options: {
              "Customer Agrees": {
                workflow: [
                  "Fill the DND form",
                  "Give TAT: Within 30 days it will be activated"
                ],
                notes: "Cx call and ask to turn on DND. Guide them and fill the DND form",
                tagging: "General Query -> Account Related -> DND Activation"
              },
              "Customer Disagrees": {
                notes: "Cx call and ask to turn on DND. Guide to the customer. Customer disagree",
                tagging: "General Query -> Account Related -> DND Activation"
              }
            }
          },
          "Deactivation": {
            script: "I can help you with DND deactivation. Let me check - have you ever activated DND from our side?",
            workflow: ["Ask customer if they ever activated DND from our side"],
            options: {
              "Yes - Customer Activated DND": {
                workflow: ["Send email to Technical team, cc tlchc, sme"],
                email: {
                  subject: "Request to Remove DND",
                  to: "technical@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

Customer called and requested to remove the DND from their account.

Customer number: [CUSTOMER_NUMBER]

Regard,
CHC`
                },
                notes: "Cx call and want to deactivate DND. Customer confirmed they enabled DND from our side. Send email to technical team",
                tagging: "General Query -> Account Related -> DND Activation"
              },
              "No - Customer Never Activated DND": {
                script: "Since you haven't activated DND from our side, please try logging out and logging in again. If the issue persists, try uninstalling and reinstalling the app.",
                workflow: [
                  "Guide customer to logout and relogin",
                  "If issue persists, guide to uninstall and reinstall app"
                ],
                notes: "Cx call and want to deactivate DND. Ask customer if they enabled DND from our side - customer disagree. Guide to the customer, customer agree",
                tagging: "General Query -> Account Related -> DND Activation"
              }
            }
          }
        }
      },

      "OTP/PASSWORD": {
        script: "I understand you're not receiving OTPs for login. Let me check a few things for you.",
        workflow: [
          "Ask probing questions:",
          "1. Did you ever activate DND from our side?",
          "2. Is your internet connection stable?"
        ],
        options: {
          "Yes - DND Activated": {
            workflow: ["Send an email to technical team, CC tlchc, sme"],
            email: {
              subject: "Customer Unable to Receive OTP - DND Deactivation Request",
              to: "technical@licious.com",
              cc: "tlchc@licious.com, sme@licious.com",
              body: `Hi Team,

Customer called CHC and confirmed they are unable to receive OTP. Upon checking, DND is enabled from our side. Kindly deactivate the DND.

Customer number: [CUSTOMER_NUMBER]

Regards,
CHC`
            },
            notes: "Cx called saying they aren't receiving OTP. Guided and confirmed DND is active. Sent email to technical team to deactivate DND.",
            tagging: "Account Related -> OTP/Password Issue"
          },
          "No - DND Not Activated": {
            script: "Since DND is not activated from our side, let's try some basic troubleshooting steps.",
            workflow: [
              "Guide customer to logout and login again",
              "If issue persists, uninstall and reinstall the app"
            ],
            notes: "Cx called saying they aren't receiving OTP. Guided with basic troubleshooting. Customer agreed.",
            tagging: "Account Related -> OTP/Password Issue"
          }
        }
      },

      "Request to add/edit address": {
        script: "Apologies to the customer and guide them that we are not able to edit or add the address from our side.",
        workflow: [
          "Apologize to the customer",
          "Inform them we cannot add/edit the address from our end",
          "Guide them to add or edit the address directly in the app"
        ],
        notes: "Cx called and asked to add/edit the address. Guided them properly. Customer agreed.",
        tagging: "Account Related -> Request to add/edit Address"
      },

      "Request to add/edit Phone no.": {
        script: "Apologies to the customer and guide them that we are not able to edit or add the phone number from our side.",
        workflow: [
          "Apologize to the customer",
          "Inform them we cannot add/edit the phone number from our end",
          "Guide them to add or edit the phone number directly in the app"
        ],
        notes: "Cx called and asked to add/edit the phone number. Guided them properly. Customer agreed.",
        tagging: "Account Related -> Request to add/edit Phone number"
      },

      "Request to delete account": {
        script: "Apologies to the customer and try to understand their reason for wanting to delete the account. Politely try to convince them to continue using our services.",
        workflow: [
          "Apologize to the customer",
          "Ask for the reason for account deletion",
          "Try to convince the customer to continue using our services"
        ],
        options: {
          "Customer Convinced": {
            notes: "Cx called to delete the account. Convinced the customer successfully. Customer agreed.",
            tagging: "Account Related -> Request to Delete the Account"
          },
          "Customer Not Convinced": {
            script: "Request the customer to send an email to talktous@licious.com with all the account details and inform them that our team will contact them soon.",
            email: {
              subject: "Request to Close Licious Account – [CUSTOMER_NAME or NUMBER]",
              to: "talktous@licious.com",
              body: `Hi Team,

Customer called and requested to delete or close their Licious account.

Kindly take the necessary action.

Customer Details:
Name: [CUSTOMER_NAME]
Contact Number: [CUSTOMER_NUMBER]

Regards,
CHC`
            },
            notes: "Customer called wanting to delete their account. Tried to understand the reason, but customer still wants deletion. Guided to send email to talktous@licious.com.",
            tagging: "Account Related -> Request to Delete the Account"
          }
        }
      }
    }
  },

  // ==================== BLANK CALL / CALL DROP / SPAM ====================
  "Blank call / call drop / spam": {
    subgroups: {
      "Blank call/spam Email/Wrong Number": {
        script: "Have a look on workbench... is there any ongoing shipment (using customer number). If there is no response from customer: Give disclaimer 3 times (I will be forced to disconnect the call). Cut and redial the call.",
        tagging: "Blank Call/Call Drop/Spam --> Blank Call / Spam Email / Wrong Number"
      },
      "Call Drop": {
        script: "If there is any call drop, instantly call back to customer. If customer not respond/busy, create ticket/process.",
        tagging: "SF tagging --> Blank call drop --> call drop"
      }
    }
  },

  // ==================== CANCELLATION RELATED ====================
  "Cancellation Related": {
    subgroups: {
      "Order Cancellation without consent": {
        script: "Customer complains that Licious has cancelled their order without notifying them. Licious-led cancellations can happen due to POS issues, damaged items, DE problems, rain, bandh, or traffic delays.",
        workflow: [
          "Apologize to the customer for the inconvenience",
          "Inform that due to some operational issue, the order had to be cancelled",
          "Assure that this will not happen in future orders"
        ],
        options: {
          "Licious Cancellation Complaints": {
            script: "Apologies to the customer and guide them that because of some operational issue the order got cancelled. Assure them it won't happen again.",
            options: {
              "Customer Already Paid": {
                workflow: [
                  "Guide customer that their amount is safe",
                  "Inform refund timelines: Source account within 3–5 working days, Licious Cash within 24 hours"
                ],
                notes: "Cx called and complained that order was cancelled without prior notice. Guided them and assured it won't happen in future. Customer agreed.",
                tagging: "Cancellation Related -> Order Cancelled Without Consent -> Licious Cancellation Complaints"
              },
              "Customer Didn't Pay": {
                workflow: ["Apologize and assure that it won't happen in the future orders"],
                notes: "Cx called and complained that order was cancelled without prior notice. Guided them and assured it won't happen in future. Customer agreed.",
                tagging: "Cancellation Related -> Order Cancelled Without Consent -> Licious Cancellation Complaints"
              }
            }
          },
          "CNR Cancellations": {
            script: "Customer complains that Licious cancelled their order without notifying them, but on checking in Workbench, it shows cancellation was due to Customer Not Reachable (CNR).",
            workflow: [
              "Apologize for inconvenience",
              "Inform customer that DE tried to contact them but due to improper call connectivity, the order was cancelled",
              "Assure that it will not happen again in future orders"
            ],
            options: {
              "Customer Already Paid": {
                workflow: [
                  "Guide customer that their amount is safe",
                  "Inform refund timelines: Source account within 3–5 working days, Licious Cash within 24 hours"
                ],
                notes: "Cx called and complained that the order got cancelled without notification. Guided and assured that it will not happen in future. Customer agreed.",
                tagging: "Cancellation Related -> Order Cancelled Without Consent -> Customer Cancellation"
              },
              "Customer Didn't Pay": {
                workflow: ["Apologize and assure that it won't happen again in future orders"],
                notes: "Cx called and complained that the order got cancelled without notification. Guided and assured that it will not happen in future. Customer agreed.",
                tagging: "Cancellation Related -> Order Cancelled Without Consent -> Customer Cancellation"
              }
            }
          }
        }
      },

      "Order Cancellation - Licious Factors": {
        script: "This section includes cases where the order was impacted due to internal or operational reasons like rescheduling, modification, or delivery delays.",
        options: {
          "Order Rescheduled": {
            script: "Customer complains that the order was rescheduled without consent. On checking Workbench, the order got rescheduled due to operational challenges.",
            workflow: [
              "Apologize to the customer for the inconvenience",
              "Inform that due to some operational challenges, the order was rescheduled",
              "Mention that our delivery team tried to contact the customer but was unable to connect due to poor call connectivity",
              "Assure the customer that this will not happen again in future orders"
            ],
            options: {
              "Customer Didn't Agree with Reschedule": {
                workflow: [
                  "Fill grievance and cancel the order as per customer's request",
                  "Initiate refund for the full amount"
                ],
                notes: "Cx called and asked why the order got rescheduled. Guided the customer that it was due to operational issues. Customer wanted to cancel — cancelled and refunded.",
                tagging: "Cancellation Related -> Licious Factor -> Order Reschedule"
              },
              "Reschedule Because CNR": {
                workflow: [
                  "Guide the customer that it got rescheduled because our DE tried to contact them but due to no proper call connection, it got delayed",
                  "Apologize for the inconvenience and assure that it won't happen again"
                ],
                notes: "Cx called and asked why the order got rescheduled. Guided them and assured that it won't happen again. Customer agreed.",
                tagging: "Cancellation Related -> Licious Factor -> Order Reschedule"
              }
            }
          },

          "Order Modification": {
            script: "Customer wants to cancel the order because Licious modified the quantity of a product. On checking, the modification happened due to an operational issue.",
            workflow: [
              "Apologize to the customer for the inconvenience",
              "Inform that due to some operational issue, an item was removed or quantity was changed",
              "Assure the customer that this will not happen again in future orders"
            ],
            options: {
              "Customer Wants to Cancel the Order": {
                workflow: [
                  "Cancel the entire order and initiate refund as per customer's request"
                ],
                notes: "Cx called and said their order was modified. Guided them and upon request, cancelled the order and initiated refund.",
                tagging: "Cancellation Related -> Licious Factor -> Order Modification"
              }
            }
          },

          "Delivery is Delayed": {
            script: "Customer contacts CHC complaining that the shipment has breached the committed delivery time and wants to cancel the order.",
            workflow: [
              "Apologize to the customer for the delay",
              "Inform that due to operational challenges, the shipment got delayed",
              "Contact DE > HUB > AM to check the current shipment status"
            ],
            options: {
              "Response from DE/HUB/AM": {
                workflow: ["Take TAT from backend and share with customer"],
                options: {
                  "Customer Agrees": {
                    notes: "Cx called and said the order is delayed. Called DE > HUB > AM, took TAT and shared it with the customer. Customer agreed.",
                    tagging: "Order Tracking -> Order Tracking Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: [
                      "Fill grievance and cancel the shipment",
                      "Initiate full refund as per customer's requirement"
                    ],
                    notes: "Cx called and said order is delayed. Called DE > HUB > AM, RNR. Customer disagreed — cancelled and refunded.",
                    tagging: "Cancellation Related -> Licious Factor -> Delay on Delivery"
                  }
                }
              },
              "No Response from DE/HUB/AM": {
                workflow: [
                  "Inform the customer that backend has been notified and order will be delivered ASAP"
                ],
                options: {
                  "Customer Agrees": {
                    workflow: ["Send escalation email to HUB (CC TLCHC, SME)"],
                    email: {
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      subject: "Delay in Delivery",
                      body: `Hi Team,

The customer reported that the shipment isn't delivered yet and is already 30 minutes late. Please check and ensure delivery ASAP.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx called and said shipment is delayed. Called DE > HUB > AM, RNR. Customer agreed. Sent email to HUB for follow-up.",
                    tagging: "Order Tracking -> Order Tracking Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: [
                      "Fill grievance and cancel the shipment",
                      "Initiate full refund as per customer's request"
                    ],
                    notes: "Cx called and said shipment is delayed. Called DE > HUB > AM, RNR. Customer disagreed — cancelled and refunded.",
                    tagging: "Cancellation Related -> Licious Factor -> Delay on Delivery"
                  }
                }
              }
            }
          }
        }
      },

      "Changed mind [ssi]": {
        script: "Customer decided to cancel the entire order [he/she changed their mind] [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> change mind"
      },

      "Add/remove item": {
        script: "We cannot add items; we only remove items and cancel [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> forgot to add/remove item"
      },

      "Forgot to apply coupon": {
        script: "We can apply a coupon on behalf of customer [before billed]. After bill, if customer wants to cancel the order [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> forgot to apply coupon"
      },

      "Order got split": {
        script: "The order already got split by the app. Now customer wants to cancel the order [before billed] [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> order split in different slot"
      },

      "Preferred slot unavailable": {
        script: "Customer placed an order but wants to change it to a different slot which is not available [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> slot unavailable to reschedule"
      },

      "Customer Not available": {
        script: "Customer is not available to take the order, so they cancel the order [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> not available to receive order"
      },

      "Chose a wrong Address": {
        script: "Customer chose a wrong address by mistake; they cancel the order [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> chose a wrong address"
      },

      "Payment Failed": {
        script: "Due to some technical issue, the payment failed [cancel fee applies].",
        tagging: "Cancellation related --> customer factors --> payment failed"
      }
    }
  },

  // ==================== CUSTOMER SUPPORT FEEDBACK ====================
  "Customer Support Feedback": {
    subgroups: {
      "Ambassador Appreciation": {
        script: "Thank you so much for taking the time to share this positive feedback. I will make sure to pass this on to the team!",
        workflow: [
          "Take the customer number",
          "Thank the customer for the appreciation towards the ambassador",
          "Inform the customer the appreciation will be shared"
        ],
        email: {
          subject: "Customer Appreciation for [Colleague's Name] as CHC Ambassador",
          to: "tl@licious.com",
          cc: "sme@licious.com, qa@licious.com",
          body: `Hi team,

I wanted to inform you that during a recent call with a customer, they expressed their appreciation for [Colleague's Name] and commended their efforts as a CHC Ambassador.

It's great to see such positive recognition.

Regards,
[Your Name]
CHC`
        },
        tagging: "SF tagging --> customer support feedback --> ambassador appreciation"
      },

      "CHC Ambassador Complain Related": {
        script: "I sincerely apologize for the experience. Let me collect the details and ensure this is addressed.",
        workflow: [
          "Take the customer number",
          "Apologize and check the previous ambassador details",
          "Inform the customer the necessary action will be taken and check what was the concern the customer was facing and provide the resolution accordingly",
          "Collect the ambassador details"
        ],
        email: {
          subject: "Customer Complaint Regarding CHC Ambassador",
          to: "tl@licious.com",
          cc: "am@licious.com",
          body: `Hi team,

I would like to bring to your attention that during a recent call, a customer raised a complaint concerning the conduct/performance of the CHC Ambassador. The customer expressed dissatisfaction with our service.

Best regards,
[Your Name]
CHC`
        },
        tagging: "SF tagging --> customer support feedback --> ambassador complain"
      }
    }
  },

  // ==================== DELIVERY RELATED ====================
  "Delivery Related": {
    subgroups: {
      "Delivery Executive Appreciation": {
        script: "Thank you for the positive feedback about our delivery executive. We appreciate you taking the time to share this with us and we will continue to provide you the same excellent service.",
        workflow: [
          "Thank the customer for the feedback",
          "Collect delivery executive name and shipment ID",
          "Note the specific appreciation points",
          "Send email to HUB"
        ],
        email: {
          subject: "Delivery Executive Appreciation",
          to: "hub@licious.com",
          body: `Hi Team,

I wanted to take a moment to share some positive feedback we received today. A customer called in to express their sincere appreciation for the excellent service provided by our Delivery Executive.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
        },
        notes: "Cx call and appreciate for excellent services provided by our DE",
        tagging: "General Query -> Delivery Related -> DE Appreciation"
      },

      "Delivery Address Related": {
        script: "I understand you have a concern regarding the delivery address. Let me help you with that.",
        workflow: [
          "Listen to customer's address-related concern",
          "Identify the specific issue",
          "Provide appropriate resolution based on situation"
        ],
        options: {
          "Request to deliver at different location": {
            script: "I apologize for the inconvenience. Unfortunately, we don't have access to change or edit the address once the order is placed. If you mistakenly chose the wrong address, you'll need to cancel this order and place a new order with the correct address.",
            workflow: [
              "Apologize to customer",
              "Guide them that address cannot be changed",
              "If they want to cancel, inform about cancellation fee",
              "Help them place new order with correct address"
            ],
            notes: "Cx call and ask to change the address/location. Guide them and pitch to cancel the order and place a new order...customer agree",
            tagging: "Order Related -> Delivery Address Related -> Request to deliver at a different location/Address"
          },

          "Order delivered to incorrect address": {
            script: "I sincerely apologize that your order was delivered to the wrong address. Let me verify the address with you and help resolve this immediately.",
            workflow: [
              "Apologize to customer",
              "Confirm the correct address with customer",
              "Call DE and verify where product was delivered",
              "If DE delivered to wrong address, ask him to deliver to right place - take TAT, give TAT",
              "If DE doesn't respond, call HM",
              "If HM picks call - take TAT, give TAT",
              "If HM doesn't pick call - give 30 min TAT to customer and send email to hub"
            ],
            options: {
              "DE/HM Response - Customer Agrees to Wait": {
                email: {
                  subject: "DE delivered a product in wrong address",
                  to: "hub@licious.com",
                  body: `Hi Team,

We received a complaint from a customer that their order was delivered to the wrong address. Please check and confirm where the delivery was made, and try to deliver it to the right address within 30 min.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
                },
                notes: "Cx call and tell he isn't getting his product yet. He tried to contact DE. DE confirmed that he already delivered the product. Call DE>HUB>AM> RNR. Send email to hub and give 30 min TAT to customer. Customer agree"
              }
            },
            tagging: "Order Related -> Delivery Address Related -> Order delivered to incorrect address"
          }
        }
      },

      "Delivery Executive Complaint": {
        script: "I sincerely apologize for the issue you experienced with our delivery executive. Let me help you with this concern.",
        workflow: [
          "Apologize to customer",
          "Collect specific details of the complaint",
          "Take appropriate action based on complaint type"
        ],
        options: {
          "DE Rude/Misbehavior/Request for delivery rating": {
            script: "I sincerely apologize for this unacceptable behavior. We will take strict action on this matter and make sure it won't happen in your future orders.",
            workflow: [
              "Apologize to customer",
              "Collect specific details of the incident",
              "Fill Grievance > DE Complain > Behaviour Issues",
              "Send email to HUB cc tlchc"
            ],
            email: {
              subject: "Complaint against Delivery Executive",
              to: "hub@licious.com",
              cc: "tlchc@licious.com",
              body: `Hi Team,

I am writing to bring to your attention a concern regarding customer who called CHC and expressed their complaint against DE misbehavior.

I kindly request you to look into this matter and take appropriate action.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
            },
            notes: "Cx call and complain about DE. Take it as feedback and send email to HUB",
            tagging: "Delivery Related -> Delivery Executive Complaint -> Misbehavior"
          },

          "Too many calls regarding address": {
            script: "I sincerely apologize for the inconvenience caused by multiple calls. We will take strict action on this and ensure it doesn't happen in your future orders.",
            workflow: [
              "Apologize to customer",
              "Fill Grievance > DE Complain > Behaviour Issues > Too many calls",
              "Send email to HUB cc tlchc"
            ],
            email: {
              subject: "Complaint against Delivery Executive",
              to: "hub@licious.com",
              cc: "tlchc@licious.com",
              body: `Hi Team,

I am writing to bring to your attention a concern regarding customer who called CHC and expressed their complaint against DE calling so many times for asking address.

I kindly request you to look into this matter and take appropriate action.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
            },
            notes: "Cx call and make complaint against DE calling so many times for asking address. Take it as complaint and send email to hub",
            tagging: "Delivery Related -> Delivery Executive Complaint -> Misbehavior"
          },

          "Did not deliver to doorstep": {
            script: "I apologize for this inconvenience. Let me check - is your society allowing delivery executives to come inside?",
            workflow: [
              "Apologize to customer",
              "Ask if society allows DE or not",
              "If YES - inform will take necessary action, send email to hub",
              "If NO - explain DE is not allowed, will ensure better coordination in future"
            ],
            options: {
              "Society Allows DE - Customer Complaint": {
                email: {
                  subject: "Complaint against Delivery Executive",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com",
                  body: `Hi Team,

I am writing to bring to your attention a concern regarding customer who called CHC and expressed their complaint against DE not delivering the product to doorstep even when society allows DE to go inside and deliver.

I kindly request you to look into this matter and take appropriate action.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
                },
                notes: "Cx call and make complaint against DE not delivering parcel to doorstep. Society allows DE. Take as complaint and send email to hub"
              },
              "Society Does Not Allow DE": {
                script: "I understand ma'am, but in your society DE is not allowed. Although we connected with our DE, we mentioned that he tried to contact you but due to improper call connectivity, the call didn't connect. We will make sure this doesn't happen in future orders. For now, I'll take this as feedback.",
                notes: "Cx call and make complaint against DE not delivering parcel to doorstep. Society doesn't allow DE. Take as feedback. Customer agree"
              }
            },
            tagging: "Delivery Related -> Delivery Executive Complaint -> Misbehavior"
          }
        }
      } ,

      
// ==================== DATA.JS - PART 2 (CONTINUATION) ====================
// Copy this and APPEND to Part 1 (replace the "END OF PART 1" comment)

      "Marked Delivered Not Delivered (MDND)": {
        script: "I apologize for the confusion regarding your delivery. Let me help you locate your order immediately.",
        workflow : [
          "Apologize to customer",
          "Ask probing questions to locate the order",
          "Contact delivery team for resolution"
        ],
        options: {
          "First Call - MDND": {
            script: "I apologize for the confusion. Let me check what happened with your delivery. Please help me with a few questions to locate your order.",
            workflow: [
              "Apologize to customer",
              "Ask probing questions: 1) Is your address correct? 2) Did you check your doorstep? 3) Did you receive any call from DE? 4) Cross-check if any family member took the parcel? 5) Are you living in society where DE are allowed?",
              "Call DE (take TAT, give TAT) > HUB (take TAT, give TAT) > AM (take TAT, give TAT)",
              "If no one picks up - pitch for ASAP delivery",
              "Fill Grievance > Delivery Related > MDND"
            ],
            options: {
              "Customer Accepts ASAP": {
                email: {
                  subject: "MDND",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that the shipment was marked as delivered but he had not got the product yet. Make sure to deliver this product ASAP.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
                },
                notes: "Cx call and say MDND. Ask probing questions. DE>HUB>AM. RNR pitch for ASAP. Customer agree and send mail to hub",
                tagging: "Delivery Related -> MDND -> Licious Factor/3rd Party"
              },
              "Customer Requests Refund": {
                workflow: [
                  "Initiate refund from workbench for particular order",
                  "Send email to HUB"
                ],
                email: {
                  subject: "MDND",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that the shipment was marked as delivered but he had not got the product yet. We have issued a complete refund for the customer as per their request; kindly notify the DE not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
                },
                notes: "Cx call and say MDND. Ask probing questions. DE>HUB>AM. RNR pitch for ASAP. Customer disagree, initiate refund and send mail to hub",
                tagging: "Delivery Related -> MDND -> Licious Factor/3rd Party"
              }
            }
          },

          "Second Call - MDND": {
            script: "I sincerely apologize that you still haven't received your order. This is unacceptable. Let me escalate this immediately.",
            workflow: [
              "Apologize to customer",
              "Call DE (take TAT, give TAT) > HUB (take TAT, give TAT) > AM (take TAT, give TAT)",
              "If no one picks call - Fill Grievance and initiate full refund",
              "Send email to hub"
            ],
            email: {
              subject: "MDND - 2nd Call",
              to: "hub@licious.com",
              cc: "tlchc@licious.com, sme@licious.com",
              body: `Hi Team,

A customer contacted CHC for the 2nd time and complained that the shipment was marked as delivered but he had not got the product yet. We have issued a complete refund for the customer as per their request; kindly notify the DE not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
            },
            notes: "Cx call 2nd time and say MDND. DE>HUB>AM. RNR. Initiate refund and send email to HUB not to deliver the product",
            tagging: "Delivery Related -> MDND -> Licious/3P Delivery"
          }
        }
      },

      "Partial Order Received": {
        script: "I sincerely apologize that you received an incomplete order. Let me help you get the missing items immediately.",
        workflow: [
          "Apologize to customer",
          "Identify which products are missing",
          "Take action to deliver missing items or process refund"
        ],
        options: {
          "First Call - Partial Order": {
            script: "I sincerely apologize that you received an incomplete order. Let me help you get the missing items immediately.",
            workflow: [
              "Apologize to customer",
              "Ask which product is missing",
              "Ask: Did you open the boxes?",
              "Check for any Licious modification in workbench",
              "Call DE (take TAT, give TAT) > HUB (take TAT, give TAT) > AM (take TAT, give TAT)",
              "If no one picks up - pitch for ASAP delivery",
              "Fill Grievance"
            ],
            options: {
              "Customer Agrees to Wait": {
                email: {
                  subject: "Partial Order Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that few items in the order were missing. We tried to contact but due to RNR, pitched for ASAP and customer agreed with this. Try to take this delivery as a priority and deliver it ASAP.

Shipment id: [SHIPMENT_ID]
Missing Product: [PRODUCT_LIST]

Regards,
CHC`
                },
                notes: "Cx call and say partial order delivered. After confirming, contact DE>HUB>AM. RNR pitch for ASAP, customer agree. Send email to HUB",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              },
              "Customer Requests Refund": {
                workflow: [
                  "Apologize for inconvenience",
                  "Initiate refund by workbench",
                  "Send email to hub"
                ],
                email: {
                  subject: "Partial Order Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that few items in the order were missing. We have issued a partial refund for the customer as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Missing Product: [PRODUCT_LIST]

Regards,
CHC`
                },
                notes: "Cx call and say partial order delivered. Call DE>HUB>AM. RNR. ASAP customer disagree and asking for refund. Initiate refund and send mail to hub not to deliver the product",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              },
              "DE/HUB/AM Responds - Customer Agrees": {
                notes: "Cx call and confirm partial order received. Call DE>HUB>AM. Take TAT, give TAT. Customer agree",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              },
              "DE/HUB/AM Responds - Customer Wants Refund": {
                workflow: [
                  "Initiate refund to customer for partial product",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Partial Order Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that few items in the order were missing. We have issued a partial refund for the customer as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Missing Product: [PRODUCT_LIST]

Regards,
CHC`
                },
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              }
            }
          },

          "Second Call - Partial Order": {
            script: "I apologize that you still haven't received the missing items. Let me check the status immediately.",
            workflow: [
              "Apologize to customer",
              "Call DE > HUB > AM"
            ],
            options: {
              "Response Received - Customer Agrees": {
                workflow: ["Take TAT and give TAT"],
                notes: "Cx call 2nd time and say he/she didn't get missing order yet. Call DE>HUB>AM. Take TAT, give TAT. Customer agree",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              },
              "Response Received - Customer Wants Refund": {
                workflow: [
                  "Apologize to customer",
                  "Initiate refund by resume grievance",
                  "Send email to hub"
                ],
                email: {
                  subject: "Partial Order Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that few items in the order were missing. We have issued a partial refund for the customer as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Missing Product: [PRODUCT_LIST]

Regards,
CHC`
                },
                notes: "Cx call 2nd time and didn't get missing order yet. Call DE>HUB>AM (take TAT, give TAT). Customer disagree and want refund. Initiate refund. Send mail to HUB",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              },
              "No Response - Refund Initiated": {
                workflow: [
                  "Apologize to customer",
                  "Initiate refund by resume grievance",
                  "Send email to hub"
                ],
                email: {
                  subject: "Partial Order Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that few items in the order were missing. We have issued a partial refund for the customer as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Missing Product: [PRODUCT_LIST]

Regards,
CHC`
                },
                notes: "Cx call 2nd time and didn't get missing order yet. Call DE>HUB>AM. RNR. Initiate refund. Send mail to HUB",
                tagging: "Delivery Related -> Incorrect Quantity Delivered"
              }
            }
          }
        }
      },

      "Preferred Delivery Slot Not Available": {
        script: "I understand you're looking for a specific delivery slot. Let me check availability for you.",
        workflow: [
          "Confirm the product name and slot customer wants",
          "Confirm the date they want",
          "Check from workbench if preferred slot is available"
        ],
        options: {
          "Preferred Slot Available": {
            workflow: ["Place order on behalf of the customer"],
            notes: "Cx call and ask for preferred slot not available. Check in workbench. Preferred slot is available. Ask and place the order on behalf of the customer in POD",
            tagging: "Delivery Related -> Preferred Delivery Slot Not Available"
          },
          "Preferred Slot Not Available": {
            workflow: [
              "Confirm the product name and slot customer wants",
              "Check from workbench - preferred slot not available",
              "Guide customer that preferred slot is not available",
              "Pitch to place order in different slot"
            ],
            notes: "Cx call and ask for preferred slot not available. Check in workbench. It's not there. Guide customer and pitch to place order in different slot. Customer agree",
            tagging: "Delivery Related -> Preferred Delivery Slot Not Available"
          }
        }
      },

      "Request to Add Delivery Instructions": {
        script: "I'll be happy to help you add delivery instructions to ensure smooth delivery.",
        workflow: [
          "Collect delivery instructions from customer",
          "Update in system or communicate to delivery team"
        ],
        options: {
          "Landmark/Alternate Number": {
            script: "I'll make sure to add your landmark to help our delivery executive find you easily.",
            workflow: [
              "Ask for actual landmark",
              "Send email to HUB with landmark details"
            ],
            email: {
              subject: "Additional Landmark",
              to: "hub@licious.com",
              body: `Hi Team,

Customer called CHC and asked to add a landmark which is [LANDMARK]. Kindly share it to DE so it may help them to deliver the product fast.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
            },
            notes: "Cx call and request to add landmark. Guide them and send email to HUB",
            tagging: "Delivery Related -> Request to Add Delivery Instructions -> Landmark Provided"
          }
        }
      },

      "Wrong Product Delivered": {
        script: "I sincerely apologize that you received the wrong product. Let me help you get the correct item immediately.",
        workflow: [
          "Apologize to customer",
          "Verify the correct and wrong products",
          "Arrange replacement or refund"
        ],
        options: {
          "First Call - Wrong Product": {
            script: "I sincerely apologize that you received the wrong product. Let me verify and help you get the correct item immediately.",
            workflow: [
              "Apologize to customer",
              "Confirm the product name on label",
              "Call DE > HUB > AM",
              "Fill Grievance > Delivery Related > Wrong Product Delivered"
            ],
            options: {
              "Response Received - Customer Agrees": {
                workflow: [
                  "Take TAT, give TAT",
                  "Apologize and assure delivery soon"
                ],
                notes: "Cx call and confirm product was wrong. DE>HUB>AM. Take TAT, give TAT. Customer agree",
                tagging: "Delivery Related -> Wrong Product Delivered"
              },
              "Response Received - Customer Wants Refund": {
                workflow: [
                  "Apologize for inconvenience",
                  "Resume Grievance and refund",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Wrong Product Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that wrong product was delivered. We have issued a refund for wrong product delivered as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
                },
                notes: "Cx call and say DE gave wrong product. Cross-check and call DE>HUB>AM. Take TAT, give TAT. Customer disagree. Initiate refund and send mail to HUB",
                tagging: "Delivery Related -> Wrong Product Delivered"
              },
              "No Response - Customer Agrees ASAP": {
                workflow: [
                  "Fill Grievance > Delivery Related > Wrong Product Delivered",
                  "Pitch for ASAP delivery",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Wrong Product Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

The customer contacted CHC and complained that wrong product is delivered. We are unable to establish any contact with delivery hero; request that you please prioritize and deliver the missing item as soon as possible.

Shipment id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
                },
                notes: "Cx call and confirm wrong product delivered. Call DE>HUB>AM. RNR pitch for ASAP. Customer agree. Send mail to HUB",
                tagging: "Delivery Related -> Wrong Product Delivered"
              },
              "No Response - Customer Wants Refund": {
                workflow: [
                  "Apologize for inconvenience",
                  "Resume Grievance and refund",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Wrong Product Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that wrong product was delivered. We have issued a refund for wrong product delivered as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
                },
                notes: "Cx call and say DE gave wrong product. Cross-check and call DE>HUB>AM. RNR. Customer disagree. Initiate refund and send mail to HUB",
                tagging: "Delivery Related -> Wrong Product Delivered"
              }
            }
          },

          "Second Call - Wrong Product": {
            script: "I sincerely apologize that you still haven't received the correct product. This is completely unacceptable. Let me escalate this immediately.",
            workflow: [
              "Apologize for inconvenience",
              "Call DE > HUB > AM"
            ],
            options: {
              "Response - Customer Agrees": {
                workflow: ["Take TAT, give TAT"],
                notes: "Cx call 2nd time asking where is my product. DE>HUB>AM. Take TAT, give TAT. Customer agree",
                tagging: "Delivery Related -> Wrong Product Delivered"
              },
              "Response - Customer Wants Refund": {
                workflow: [
                  "Apologize for inconvenience",
                  "Resume Grievance and refund",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Wrong Product Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that wrong product was delivered. We have issued a refund for wrong product delivered as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
                },
                notes: "Cx call 2nd time and say DE gave wrong product. Cross-check and call DE>HUB>AM. Take TAT, give TAT. Customer disagree. Initiate refund and send mail to HUB",
                tagging: "Delivery Related -> Wrong Product Delivered"
              },
              "No Response - Refund": {
                workflow: [
                  "Apologize for inconvenience",
                  "Resume Grievance and refund",
                  "Send email to HUB"
                ],
                email: {
                  subject: "Wrong Product Delivered",
                  to: "hub@licious.com",
                  cc: "tlchc@licious.com, sme@licious.com",
                  body: `Hi Team,

A customer contacted CHC and complained that wrong product was delivered. We have issued a refund for wrong product delivered as per their request; kindly notify the delivery hero not to deliver the product to the customer.

Shipment id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
                },
                notes: "Cx call 2nd time. Cross-check and call DE>HUB>AM. RNR. Initiate refund and send mail to HUB",
                tagging: "Delivery Related -> Wrong Product Delivered"
              }
            }
          }
        }
      },

      "Early Delivery Complaint": {
        script: "I apologize if the early delivery caused any inconvenience to you. We appreciate your feedback and will work to minimize such issues in future orders.",
        workflow: [
          "Check in workbench if order was delivered before scheduled slot",
          "Apologize to customer",
          "Inform taking this as complaint",
          "Fill Grievance > Delivery Related > Early Delivery Complaint",
          "Send email to HUB"
        ],
        email: {
          subject: "Early Delivery Complaint",
          to: "hub@licious.com",
          cc: "tlchc@licious.com, sme@licious.com",
          body: `Hi Team,

The customer called CHC and made a complaint about early delivery.

Shipment id: [SHIPMENT_ID]

Regards,
CHC`
        },
        notes: "Cx call and make complaint about early delivery. Apologize to customer and send mail to HUB",
        tagging: "Order Related -> Order Tracking -> Early Delivery Complaint"
      }
    }
  },

  // ==================== ORDER TRACKING ====================
  "Order Tracking": {
    subgroups: {
      "OT within SLA": {
        script: "Customer may call on a running shipment. Guide the customer that the order will be delivered within the committed delivery slot or express time.",
        workflow: [
          "Check shipment status in Workbench",
          "If within SLA: assure delivery within slot/express time"
        ],
        options: {
          "Before 15 mins threshold": {
            workflow: [
              "Guide that the order will be delivered within SLA",
              "Send mail to HUB (cc TLCHC, SME)"
            ],
            email: {
              subject: "Delay on Delivery",
              to: "hub@licious.com",
              cc: "tlchc@licious.com, sme@licious.com",
              body: `Hi Team,

Customer called CHC within SLA but shipment is still in accepted/billed state. Kindly deliver the product ASAP.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
            },
            notes: "Cx called and said the order is delayed. Guided that it will be delivered within SLA. Email sent to HUB.",
            tagging: "Order Related -> Order Tracking -> OT within SLA"
          },

          "Order is Delayed (Threshold Not Crossed)": {
            script: "Apologize and call DE > HUB > AM for update.",
            options: {
              "Any response from DE/HUB/AM": {
                workflow: ["Provide TAT to customer"],
                options: {
                  "Customer Agrees": {
                    notes: "Cx called regarding delay. Contacted DE/HUB/AM and shared TAT. Cx agreed.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: [
                      "Fill grievance, cancel order and initiate refund"
                    ],
                    email: {
                      subject: "Delay on Delivery Cancellation",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and complained the order is delayed and not delivered yet. We initiated refund as per customer request. Kindly notify the DE not to deliver the order.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx called and complained about delay. Order cancelled and refund initiated. Mail sent to HUB.",
                    tagging: "Cancellation Related -> Licious Factor -> Delay on Delivery"
                  }
                }
              },

              "No response from DE/HUB/AM": {
                workflow: [
                  "Guide delayed due to operational challenges",
                  "Pitch ASAP resolution"
                ],
                options: {
                  "Customer Agrees": {
                    email: {
                      subject: "Delay on Delivery",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and reported delay in delivery. As shipment is still in accepted/billed state, kindly deliver the product ASAP.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx called for delay. DE/HUB/AM RNR. ASAP pitch accepted. Email sent to HUB.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: [
                      "Fill grievance, cancel order and initiate refund"
                    ],
                    email: {
                      subject: "Delay on Delivery Cancellation",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and complained the order is delayed and not delivered yet. We initiated refund as per customer request. Kindly notify the DE not to deliver the order.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx did not agree for TAT. Order cancelled and refund initiated. Email sent to HUB.",
                    tagging: "Cancellation Related -> Licious Factor -> Delay on Delivery"
                  }
                }
              }
            }
          },

          "Threshold Already Crossed": {
            workflow: [
              "Apologize & confirm shipment is delayed",
              "Call DE > HUB > AM"
            ],
            options: {
              "Any response from DE/HUB/AM": {
                workflow: ["Provide TAT"],
                options: {
                  "Customer Agrees": {
                    notes: "Cx called regarding delay. TAT given. Cx agreed.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: ["Fill grievance, cancel order & refund"],
                    email: {
                      subject: "Delay on Delivery Cancellation",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and reported delay in delivery. We cancelled and refunded as per customer request. Kindly notify DE not to deliver the order.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx wanted cancellation. Order cancelled & refund done.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  }
                }
              },

              "No response from DE/HUB/AM": {
                workflow: ["Pitch ASAP"],
                options: {
                  "Customer Agrees": {
                    email: {
                      subject: "Delay on Delivery",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and reported delay in delivery. Kindly ensure ASAP delivery.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx agreed after ASAP pitch. Email sent.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  },
                  "Customer Disagrees": {
                    workflow: ["Fill grievance, cancel order & refund"],
                    email: {
                      subject: "Delay on Delivery Cancellation",
                      to: "hub@licious.com",
                      cc: "tlchc@licious.com, sme@licious.com",
                      body: `Hi Team,

Customer called CHC and reported delay in delivery. We cancelled and refunded as per customer request. Kindly notify DE not to deliver the order.

Shipment ID: [SHIPMENT_ID]

Regards,
CHC`
                    },
                    notes: "Cx did not agree. Order cancelled & refund initiated.",
                    tagging: "Order Tracking -> Order Tracking – Outside SLA"
                  }
                }
              }
            }
          }
        }
      }
    }
  } ,


  // ==================== TO BE CONTINUED IN PART 3 ====================
  // Say "continue" to get Part 3 with Payment, Product Quality, and Helper Functions


// ==================== DATA.JS - PART 3 (FINAL PART) ====================
// Copy this and APPEND to Part 2 (replace the "TO BE CONTINUED" comment)

  // ==================== PAYMENT RELATED ====================
  "Payment Related": {
    subgroups: {
      "COD/POD": {
        script: "Apologies to customer and inform that we don't have Cash on Delivery. We are moving towards digital payment methods.",
        workflow: [
          "Apologize to customer",
          "Inform COD not available",
          "Guide to use online payment methods"
        ],
        tagging: "Payment related --> COD/POD related"
      },

      "Money Debited Order Not Placed": {
        script: "Apologies to customer and check in workbench (payment method Razorpay/PTM/etc.). Check in Razorpay if the payment is created (wait for 7 min), authorized, stuck in gateway (auto refunded in 10 mins), captured payment is received, failed payment got failed, refunded payment good refunded already.",
        workflow: [
          "Apologize to customer",
          "Check workbench for payment status",
          "Check Razorpay payment gateway status",
          "Created - Wait 7 minutes",
          "Authorized - Payment processing",
          "Stuck in gateway - Auto refund in 10 mins",
          "Captured - Payment received",
          "Failed - Payment failed",
          "Refunded - Already refunded"
        ],
        tagging: "Payment related -> Money debited order not placed"
      },

      "Multiple payments": {
        script: "Apologies to customer and check in workbench (then Razorpay) if double payment happened, initiate full refund form.",
        workflow: [
          "Apologize to customer",
          "Check workbench for multiple payments",
          "Verify in Razorpay",
          "If double payment confirmed, initiate full refund for duplicate payment"
        ],
        tagging: "Payment related --> Multiple payments"
      },

      "Payment failed": {
        script: "Apologies to customer and educate them that the payment failed, your money is safe and will be refunded in 24-48 hrs.",
        workflow: [
          "Apologize to customer",
          "Explain payment failure",
          "Assure money is safe",
          "Inform refund timeline: 24-48 hours"
        ],
        tagging: "Payment related --> Payments failed"
      },

      "Payment page too slow": {
        script: "Apologies to customer and check if there is any issue from our side. Also mention to check net connectivity to customer.",
        workflow: [
          "Apologize to customer",
          "Check for system issues",
          "Guide customer to check internet connectivity",
          "Send email to TLCHC if widespread issue"
        ],
        email: {
          subject: "Payment Page Performance Issue",
          to: "tlchc@licious.com",
          body: `Hi Team,

Customer reported payment page loading slowly.

Customer's contact no: [CUSTOMER_NUMBER]
Issue: Payment page too slow

Regards,
CHC`
        },
        tagging: "Payment related --> Payment page too slow"
      },

      "Preferred payment mode not available": {
        script: "Apologies to customer and provide them information that we have these online methods to pay, but take it as feedback and share with the relevant team.",
        workflow: [
          "Apologize to customer",
          "List available payment methods",
          "Take feedback for unavailable payment method",
          "Forward to relevant team"
        ],
        tagging: "Payment related --> Preferred payment mode not available"
      },

      "Payment link Request": {
        script: "Apologies to customer and inform that we don't have payment link method for now, but take it as feedback and share with my team.",
        workflow: [
          "Apologize to customer",
          "Inform payment link not available currently",
          "Take as feedback",
          "Share with relevant team"
        ],
        tagging: "Payment related --> Preferred payment link"
      },

      "Wallet DE-link": {
        script: "Apologies to customer and guide them to de-link other wallets from apps. For Amazon Pay: Account → Login at other apps → Linked apps (remove it)",
        workflow: [
          "Apologize to customer",
          "Guide step by step to de-link wallet",
          "Amazon Pay: Account > Login at other apps > Linked apps > Remove",
          "For other wallets, provide specific steps"
        ],
        tagging: "Payment related --> Wallet delink query"
      }
    }
  },

  // ==================== PRICING & BILLING RELATED ====================
  "Pricing & Billing Related": {
    subgroups: {
      "Extra Grammage Charge": {
        script: "Inform the customer we don't charge for extra grammage. If customer paid online and received less grammage, check the invoice in workbench and refund the amount if customer is eligible.",
        workflow: [
          "Inform no extra grammage charges",
          "If less grammage received, check invoice",
          "Process refund if eligible"
        ],
        tagging: "Pricing & Billing related --> Extra Grammage received"
      },

      "Grammage enquiry": {
        script: "The grammage difference is caused due to processing of the meat. At Licious, we have standard cuts and do not compromise on them. We may deliver more grammage but never less grammage. If less grammage is delivered, we will process the extra charged amount to Licious cash wallet within 24hrs of delivery.",
        workflow: [
          "Explain grammage variation due to meat processing",
          "Assure standard cuts maintained",
          "May deliver more, never less",
          "Auto refund within 24 hours if less grammage"
        ],
        tagging: "Pricing & Billing related --> Grammage enquiry"
      },

      "Less Grammage received": {
        script: "Apologies to the customer and with help of invoice educate them that if there is any less grammage received, it will auto refund to your Licious cash within 24 hr after delivery.",
        workflow: [
          "Apologize to customer",
          "Check invoice for grammage",
          "Inform auto refund process",
          "Refund to Licious cash within 24 hours"
        ],
        tagging: "Pricing & Billing related --> Less Grammage received"
      },

      "Inconsistency in price during checkout": {
        script: "Apologies to the customer. Try ordering the same product (to check if there is any glitch on our side). Guide them to place the order and refund the extra amount to Licious cash with TL approval.",
        workflow: [
          "Apologize to customer",
          "Test order same product to check for glitch",
          "If price inconsistency confirmed, get TL approval",
          "Refund extra amount to Licious cash"
        ],
        email: {
          subject: "Inconsistency in price during checkout",
          to: "tl@licious.com",
          cc: "sme@licious.com",
          body: `Hi team,

A customer is facing price fluctuation issues during placing an order.

Shipment id: [SHIPMENT_ID]
Product details: [PRODUCT_NAME]
Issue: [DESCRIPTION]

Attached image: [IF_AVAILABLE]

Regards,
CHC`
        },
        tagging: "Pricing & Billing related --> Inconsistency in price during checkout"
      },

      "Invoice Unclear": {
        script: "Apologies to the customer and check in workbench if the amount has been charged correctly after discount. If customer wants invoice, send invoice. If mismatch exists, after confirmation refund the extra amount customer paid.",
        workflow: [
          "Apologize to customer",
          "Check workbench for correct charges",
          "Send invoice if requested",
          "If mismatch found, refund extra amount"
        ],
        tagging: "Pricing & Billing related --> Invoice unclear"
      },

      "Product too expensive": {
        script: "Apologies for inconvenience. I totally understand your concern sir... but we charge for actual product which is good in quality and hygiene. Licious meat is freshest; all products are steroid-free and chemical-free. We only charge for net weight, so price may appear a little expensive.",
        workflow: [
          "Apologize and empathize",
          "Explain quality standards",
          "Highlight steroid-free, chemical-free products",
          "Explain net weight pricing",
          "Take as feedback"
        ],
        tagging: "Pricing & Billing related --> Product too expensive"
      },

      "Sudden increase in product price": {
        script: "I understand your concern sir. Our prices remain competitive, with slight increase due to quality selection and local demand. We don't charge for wastage. But for now, I take it as feedback to be shared with the relevant team.",
        workflow: [
          "Empathize with customer",
          "Explain price factors: quality, demand",
          "Assure no wastage charges",
          "Take as feedback"
        ],
        tagging: "Pricing & Billing related --> Sudden increase in product price"
      },

      "Unable to view/download Invoice": {
        script: "Fetch the shipment ID (using mobile no.). If you can view the invoice, share it with the customer. Also guide the customer that from the app/web they can select 'My Order' from the list of orders, select and view details, scroll below.",
        workflow: [
          "Fetch shipment ID using mobile number",
          "If visible, share invoice with customer",
          "Guide: App > My Order > Select Order > View Details > Scroll down"
        ],
        tagging: "Pricing & Billing related --> Unable to view/download invoice"
      }
    }
  },

  // ==================== PRODUCT QUALITY ====================
  "Product Quality": {
    subgroups: {
      "Cut Issues/Bone Meat Ratio/Size/Meatiness/Specification issue": {
        script: "Apologies to the customer and try to understand their concern. If complaint is about SMALL or LARGE pieces: Confirm total number of pieces received in that net weight; if it matches website description, it is the right product. Educate the customer accordingly.",
        workflow: [
          "Apologize and understand concern",
          "If SMALL/LARGE pieces complaint:",
          "  - Confirm total pieces in net weight",
          "  - Match with website description",
          "  - If correct, educate customer",
          "If LESS pieces complaint:",
          "  - Confirm label details and net weight",
          "  - If mismatch, report GRIV & FIR",
          "Bone Meat Ratio:",
          "  - Lamb & Goat bony: 70% bone-in, 30% boneless",
          "  - Hyderabad: 65% bone-in, 35% boneless",
          "If post-cooking complaint:",
          "  - Probe cooking time (7+ whistles = overcooked)"
        ],
        tagging: "Product Quality -> Cut Issues"
      },

      "Cleanliness Issue/High Drip": {
        script: "Apologies to the customer and try to understand their concern. Product info: Blood drip or Fat/skin not trimmed - Educate customers skin on wings not completely trimmed for Chicken category. For first-time Licious customers, explain myoglobin causes red color. Prawns not deveined: only upper vein removed, lower vein safe to consume.",
        workflow: [
          "Apologize and understand concern",
          "Blood drip: Explain myoglobin (not actual blood)",
          "Fat/Skin: Wings skin not fully trimmed (standard)",
          "Prawns: Upper vein removed, lower vein safe",
          "Raise Grievance in Workbench: Cleanliness Issue"
        ],
        tagging: "Product Quality -> Cleanliness Issue"
      },

      "Taste Issues": {
        script: "Apologies to the customer and try to understand their concern. Product info: Frozen meat texture will be hard. Chicken takes 20-25 minutes for cooking. Mutton takes 5-6 whistles.",
        workflow: [
          "Apologize and understand concern",
          "Frozen meat: Texture naturally hard",
          "Chicken: 20-25 minutes cooking time",
          "Mutton: 5-6 whistles required",
          "Check if cooking instructions followed",
          "Raise Grievance: Taste Issues"
        ],
        tagging: "Product Quality -> Taste Issues"
      },

      "Product Damage": {
        script: "Product info: Marinades and Whole Chicken not vacuum packed. Fish & seafood loosely vacuum packed. Check Kebabs use within UBD and storage in chilled. Educate customer to use within Use By Date and follow cooking instructions.",
        workflow: [
          "Understand damage type",
          "Marinades/Whole Chicken: Not vacuum packed (standard)",
          "Fish/Seafood: Loosely vacuum packed",
          "Check Use By Date",
          "Check storage conditions",
          "Educate on proper storage: Chilled",
          "Raise Grievance: Product Damaged"
        ],
        tagging: "Product Quality -> Product Damage"
      },

      "Health Issues": {
        script: "Apologies and ask: Did you consume the product before expiry? Did you notice any bad smell?",
        workflow: [
          "Apologize sincerely",
          "Ask: Consumed before expiry date?",
          "Ask: Any bad smell noticed?",
          "Ask: Proper storage maintained?",
          "Fill grievance immediately",
          "If refund eligible, process refund",
          "Escalate to quality team",
          "Follow up with customer"
        ],
        tagging: "Product Quality -> Health Issues"
      },

      "Contamination/Spoilage": {
        script: "Apologies and arrange reverse pickup (except Kolkata). Give refund based on refund type.",
        workflow: [
          "Apologize immediately",
          "Arrange reverse pickup (Not in Kolkata)",
          "Fill Grievance: Contamination",
          "Process refund",
          "Send email to hub, cc city-quality, tlchc, sme"
        ],
        email: {
          subject: "PQ issue - Reverse Pickup [SHIPMENT_ID]",
          to: "hub@licious.com",
          cc: "city-quality@licious.com, tlchc@licious.com, sme@licious.com",
          body: `Hi Team,

Please arrange reverse pickup for contaminated product.

Shipment Id: [SHIPMENT_ID]
SKU name: [PRODUCT_NAME]
Customer phone: [CUSTOMER_NUMBER]

Regards,
CHC`
        },
        tagging: "Product Quality -> Contamination"
      },

      "Discoloration/Appearance": {
        script: "Product info: Confirm if discoloration observed before or after opening. Inform customer color variation can be breed-dependent.",
        workflow: [
          "Apologize and understand concern",
          "Ask: Before or after opening?",
          "Explain: Color variation breed-dependent",
          "Check if within Use By Date",
          "Raise Grievance: Discoloration"
        ],
        tagging: "Product Quality -> Discoloration"
      },

      "Expired Product/Shelf Life": {
        script: "Please refer customer to the Shelf Life Chart below for product shelf life information.",
        workflow: [
          "Check product receipt date",
          "Check Use By Date on package",
          "Refer to Shelf Life Chart",
          "If expired on receipt, full refund",
          "If expired due to delayed use, educate customer"
        ],
        tagging: "Product Quality -> Expired Product"
      },

      "Texture": {
        script: "Apologies and ask customer to explain the texture concern. If understanding issue, educate; else raise grievance.",
        workflow: [
          "Apologize and understand concern",
          "Ask detailed description of texture",
          "Check if frozen (naturally hard)",
          "Check cooking method",
          "If genuine issue, raise Grievance: Texture"
        ],
        tagging: "Product Quality -> Texture"
      },

      "Packaging Damaged/Sealing Issues/Vacuum Loss/Labelling related": {
        script: "Product info: Marinades and Whole Chicken not vacuum packed. Fish and Seafood loosely vacuum packed.",
        workflow: [
          "Apologize and understand concern",
          "Marinades/Whole Chicken: Not vacuum packed (standard)",
          "Fish/Seafood: Loosely packed (standard)",
          "If packaging torn/damaged: Raise Grievance",
          "If labelling issue: Report to quality team"
        ],
        tagging: "Product Quality -> Packaging Damage"
      },

      "Smell Issues/Freshness/Temperature": {
        script: "If understanding issue, educate customer; else raise grievance.",
        workflow: [
          "Apologize and understand concern",
          "Ask when smell was noticed",
          "Check Use By Date",
          "Check storage conditions",
          "If genuine freshness issue: Raise Grievance",
          "Process refund if eligible"
        ],
        tagging: "Product Quality -> Smell Issues"
      }
    }
    }
  }
; 

 // END OF WorkflowData OBJECT

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get all main groups (categories)
 * @returns {Array} Array of main group names
 */
function getAllMainGroups() {
  return Object.keys(WorkflowData);
}

/**
 * Get subgroups for a specific main group
 * @param {string} mainGroup - The main group name
 * @returns {Array} Array of subgroup names
 */
function getSubGroups(mainGroup) {
  if (!WorkflowData[mainGroup]) {
    console.warn(`Main group "${mainGroup}" not found`);
    return [];
  }
  return Object.keys(WorkflowData[mainGroup].subgroups);
}

/**
 * Get workflow data for a specific subgroup
 * @param {string} mainGroup - The main group name
 * @param {string} subGroup - The subgroup name
 * @returns {Object|null} Workflow data or null if not found
 */
function getWorkflowData(mainGroup, subGroup) {
  if (!WorkflowData[mainGroup]) {
    console.warn(`Main group "${mainGroup}" not found`);
    return null;
  }
  
  if (!WorkflowData[mainGroup].subgroups[subGroup]) {
    console.warn(`Subgroup "${subGroup}" not found in "${mainGroup}"`);
    return null;
  }
  
  return WorkflowData[mainGroup].subgroups[subGroup];
}

/**
 * Search workflows by keyword with relevance scoring
 * @param {string} searchTerm - The search keyword
 * @returns {Array} Array of search results sorted by relevance
 */
function searchWorkflows(searchTerm) {
  const results = [];
  const term = searchTerm.toLowerCase().trim();
  
  // Minimum search length check
  if (term.length < 2) {
    return results;
  }
  
  // Search through all workflows
  Object.keys(WorkflowData).forEach(mainGroup => {
    Object.keys(WorkflowData[mainGroup].subgroups).forEach(subGroup => {
      const content = WorkflowData[mainGroup].subgroups[subGroup];
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      
      // Check if search term matches
      if (subGroup.toLowerCase().includes(term) || 
          contentStr.toLowerCase().includes(term)) {
        results.push({
          mainGroup: mainGroup,
          subGroup: subGroup,
          content: content,
          relevance: calculateRelevance(term, subGroup, contentStr)
        });
      }
    });
  });
  
  // Sort by relevance (highest first)
  return results.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Calculate search relevance score
 * @param {string} term - Search term
 * @param {string} subGroup - Subgroup name
 * @param {string} content - Content to search
 * @returns {number} Relevance score
 */
function calculateRelevance(term, subGroup, content) {
  let score = 0;
  const termLower = term.toLowerCase();
  const subGroupLower = subGroup.toLowerCase();
  
  // Exact match in subgroup name = highest score
  if (subGroupLower === termLower) {
    score += 100;
  } else if (subGroupLower.includes(termLower)) {
    // Partial match in subgroup name
    score += 50;
  }
  
  // Count occurrences in content
  const occurrences = (content.toLowerCase().match(new RegExp(termLower, 'g')) || []).length;
  score += occurrences * 5;
  
  // Bonus for matches in script (more relevant)
  if (content.toLowerCase().includes('"script"') && 
      content.toLowerCase().includes(termLower)) {
    score += 20;
  }
  
  return score;
}

/**
 * Get all workflows with a specific tag
 * @param {string} tag - The tag to search for
 * @returns {Array} Array of workflows with matching tags
 */
function getWorkflowsByTag(tag) {
  const results = [];
  
  Object.keys(WorkflowData).forEach(mainGroup => {
    Object.keys(WorkflowData[mainGroup].subgroups).forEach(subGroup => {
      const workflow = WorkflowData[mainGroup].subgroups[subGroup];
      
      // Recursive function to check for tags in nested options
      function checkForTag(obj) {
        if (obj.tagging && obj.tagging.toLowerCase().includes(tag.toLowerCase())) {
          results.push({
            mainGroup: mainGroup,
            subGroup: subGroup,
            workflow: obj
          });
        }
        
        // Check nested options
        if (obj.options) {
          Object.values(obj.options).forEach(checkForTag);
        }
      }
      
      checkForTag(workflow);
    });
  });
  
  return results;
}

/**
 * Get workflow statistics
 * @returns {Object} Statistics about the workflow data
 */
function getWorkflowStats() {
  let totalMainGroups = 0;
  let totalSubGroups = 0;
  let totalOptions = 0;
  let totalEmails = 0;
  
  function countOptions(obj) {
    if (obj.options) {
      totalOptions += Object.keys(obj.options).length;
      Object.values(obj.options).forEach(countOptions);
    }
    if (obj.email) {
      totalEmails++;
    }
  }
  
  Object.keys(WorkflowData).forEach(mainGroup => {
    totalMainGroups++;
    totalSubGroups += Object.keys(WorkflowData[mainGroup].subgroups).length;
    
    Object.values(WorkflowData[mainGroup].subgroups).forEach(workflow => {
      countOptions(workflow);
    });
  });
  
  return {
    mainGroups: totalMainGroups,
    subGroups: totalSubGroups,
    totalOptions: totalOptions,
    emailTemplates: totalEmails,
    totalWorkflows: totalSubGroups + totalOptions
  };
}

/**
 * Validate workflow data structure
 * @returns {Object} Validation results
 */
function validateWorkflowData() {
  const errors = [];
  const warnings = [];
  
  Object.keys(WorkflowData).forEach(mainGroup => {
    if (!WorkflowData[mainGroup].subgroups) {
      errors.push(`Main group "${mainGroup}" missing subgroups`);
      return;
    }
    
    Object.keys(WorkflowData[mainGroup].subgroups).forEach(subGroup => {
      const workflow = WorkflowData[mainGroup].subgroups[subGroup];
      
      // Check for required fields
      if (typeof workflow === 'object') {
        if (!workflow.script && !workflow.workflow && !workflow.options) {
          warnings.push(`"${mainGroup} > ${subGroup}" has no content`);
        }
        
        // Check email templates
        if (workflow.email) {
          if (!workflow.email.subject || !workflow.email.to || !workflow.email.body) {
            errors.push(`"${mainGroup} > ${subGroup}" has incomplete email template`);
          }
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings
  };
}

// ==================== MODULE EXPORT ====================

window.WorkflowDataModule = {
  data: WorkflowData,
  
  // Core functions
  getAllMainGroups,
  getSubGroups,
  getWorkflowData,
  searchWorkflows,
  getWorkflowsByTag,
  
  // Utility functions
  getWorkflowStats,
  validateWorkflowData,
  
  // Helper for debugging
  getVersion: () => '2.0.0',
  getLastUpdated: () => '2024-11-24'
};

// ==================== INITIALIZATION ====================

// Auto-initialize and log stats
(function() {
  const stats = getWorkflowStats();
  const validation = validateWorkflowData();
  
  console.log('✅ WorkflowData Module Loaded Successfully!');
  console.log('📊 Statistics:', stats);
  
  if (!validation.valid) {
    console.warn('⚠️ Validation Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Validation Warnings:', validation.warnings);
  }
  
  console.log(`📚 Total Workflows: ${stats.totalWorkflows}`);
  console.log(`📧 Email Templates: ${stats.emailTemplates}`);
  console.log(`🎯 Version: 2.0.0`);
})();

// ==================== END OF DATA.JS ====================
// This is the complete, optimized, and production-ready data file!
// All 3 parts combined create the most comprehensive workflow system.