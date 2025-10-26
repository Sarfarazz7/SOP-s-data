// ==================== SESSION PERSISTENCE ====================

    const authorizedUsers = [
  { email: "sarfaraz@licious.com", phone: "+919876543210", name: "Sarfaraz" },
  { email: "saumya@licious.com", phone: "+919876543211", name: "saumya" },
  { email: "jubiya@licious.com", phone: "+919876543212", name: "jubiya" },
  { email: "asfiya@licious.com", phone: "+919876543213", name: "asfiya" },
  { email: "aisha@licious.com", phone: "+919876543214", name: "aisha" },
  { email: "abhi@licious.com", phone: "+919876543215", name: "abhi" },
];

let currentUser = null;
let currentOTP = null;
let otpEmail = null;

function saveSession(user) {
  try {
    // Save to localStorage for persistent login (no auto-logout)
    localStorage.setItem('amastor_user', JSON.stringify(user));
    localStorage.setItem('amastor_login_time', Date.now().toString());
  } catch (e) {
    console.log('LocalStorage not available');
  }
}

function loadSession() {
  try {
    const userStr = localStorage.getItem('amastor_user');
    
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (e) {
    console.log('Could not load session');
  }
  return null;
}

function clearSession() {
  try {
    localStorage.removeItem('amastor_user');
    localStorage.removeItem('amastor_login_time');
  } catch (e) {
    console.log('Could not clear session');
  }
}

    window.addEventListener('DOMContentLoaded', function () {
      const savedUser = loadSession();
      if (savedUser) {
        currentUser = savedUser;
        showApp();
      }
    });

    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function validateCredentials(email, phone) {
      return authorizedUsers.find(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.phone === phone
      );
    }

    // Send OTP
    document.getElementById('sendOtpBtn').addEventListener('click', function () {
      const email = document.getElementById('emailInput').value.trim();
      const phone = document.getElementById('phoneInput').value.trim();
      const errorDiv = document.getElementById('loginError');
      const successDiv = document.getElementById('loginSuccess');

      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      if (!email || !phone) {
        errorDiv.textContent = 'Please enter both email and phone number';
        errorDiv.style.display = 'block';
        return;
      }

      const user = validateCredentials(email, phone);

      if (user) {
        currentOTP = generateOTP();
        otpEmail = email;

        console.log('OTP for ' + email + ': ' + currentOTP);
        alert('OTP Generated: ' + currentOTP + '\n(In production, this will be sent via email)');

        successDiv.textContent = 'OTP sent to your email!';
        successDiv.style.display = 'block';

        setTimeout(() => {
          document.getElementById('loginForm').style.display = 'none';
          document.getElementById('otpForm').style.display = 'block';
        }, 1000);
      } else {
        errorDiv.textContent = 'Invalid credentials. Access denied.';
        errorDiv.style.display = 'block';
      }
    });

    // OTP Input Navigation
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', function (e) {
        if (this.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });

    // Verify OTP
    document.getElementById('verifyOtpBtn').addEventListener('click', function () {
      const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
      const errorDiv = document.getElementById('otpError');
      const successDiv = document.getElementById('otpSuccess');

      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      if (enteredOTP === currentOTP) {
        const user = authorizedUsers.find(u => u.email.toLowerCase() === otpEmail.toLowerCase());
        currentUser = user;

        saveSession(user);

        successDiv.textContent = 'Login successful!';
        successDiv.style.display = 'block';

        setTimeout(() => {
          showApp();
        }, 500);
      } else {
        errorDiv.textContent = 'Invalid OTP. Please try again.';
        errorDiv.style.display = 'block';
        otpInputs.forEach(input => input.value = '');
        otpInputs[0].focus();
      }
    });

    // Resend OTP
    document.getElementById('resendOtpLink').addEventListener('click', function () {
      currentOTP = generateOTP();
      console.log('New OTP: ' + currentOTP);
      alert('New OTP Generated: ' + currentOTP);

      const successDiv = document.getElementById('otpSuccess');
      successDiv.textContent = 'New OTP sent!';
      successDiv.style.display = 'block';

      setTimeout(() => {
        successDiv.style.display = 'none';
      }, 3000);
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
      if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        currentOTP = null;
        otpEmail = null;

        clearSession();

        document.getElementById('emailInput').value = '';
        document.getElementById('phoneInput').value = '';
        otpInputs.forEach(input => input.value = '');

        document.getElementById('appScreen').style.display = 'none';
        document.getElementById('otpForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authScreen').style.display = 'flex';
      }
    });

    // ==================== MAIN APPLICATION ====================

    function showApp() {
      document.getElementById('authScreen').style.display = 'none';
      document.getElementById('appScreen').style.display = 'block';
      document.getElementById('userEmail').textContent = currentUser.email;

      const greetingDiv = document.getElementById("greeting");
      const name = currentUser.name || "Agent";
      greetingDiv.textContent = `Hey this is ${name}... how can I help you today?`;

      initializeApp();
    }

    // Copy to clipboard function
    function copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied to clipboard!');
    }

    function initializeApp() {
      const mainGroupSelect = document.getElementById("mainGroup");
      const subGroupSelect = document.getElementById("subGroup");
      const instructionDiv = document.getElementById("instruction");
      const workflowOutput = document.getElementById("workflowOutput");
      const conditionalOptions = document.getElementById("conditionalOptions");
      const searchBox = document.getElementById("searchBox");

      // Enhanced delivery workflows data
      const deliveryWorkflows = {
        "Delivery Executive Appreciation": {
          script: "Thank you for the positive feedback about our delivery executive. I'm glad they provided excellent service!",
          workflow: [
            "Thank the customer for the feedback",
            "Collect delivery executive name and shipment ID",
            "Note the specific appreciation points"
          ],
          email: {
            subject: "Delivery Executive Name Appreciation",
            to: "hub@licious.com",
            body: `Hi team,

I would like to inform you that we received a call from a customer expressing appreciation for the efforts and professionalism of our delivery executive. The customer was particularly pleased with their service.

Best regards,
Shipment ID: [SHIPMENT_ID]
CHC`
          },
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
            "Order delivered to incorrect address": {
              script: "I sincerely apologize that your order was delivered to the wrong address. Let me help you resolve this immediately.",
              workflow: [
                "Apologize to customer",
                "Cross-check the actual delivery address",
                "Contact DE and verify where product was delivered",
                "Take TAT from DE (give 30 min if no TAT)",
                "Arrange redelivery or refund"
              ],
              tagging: "Order Related -> Delivery Address Related -> Order delivered to incorrect address"
            },
            "Request to deliver at different location": {
              script: "I understand you'd like to change the delivery address. Unfortunately, we cannot modify the address once the order is dispatched.",
              workflow: [
                "Inform customer address cannot be changed",
                "Check if order is dispatched",
                "If not dispatched, try to contact hub",
                "If dispatched, customer needs to receive at registered address"
              ],
              tagging: "Delivery Address Related -> Request to deliver at different location"
            }
          }
        },

        "Delivery Executive Complaint": {
          options: {
            "DE Bad Behaviour": {
              script: "I sincerely apologize for the unacceptable behavior from our delivery executive. This is not the service standard we maintain.",
              workflow: [
                "Apologize sincerely",
                "Collect specific details of the incident",
                "Note down DE name, time, and shipment ID",
                "Report grievance in system",
                "Assure action will be taken"
              ],
              email: {
                subject: "Customer Complaint Regarding Delivery Executive",
                to: "hub@licious.com",
                cc: "tlchc@licious.com",
                body: `Hi team,

I would like to inform you that we received a call from a customer regarding a complaint about the conduct/performance of the delivery executive. The customer expressed concerns about the service.

Please advise on the next steps or if any further action is required from my side.

Best regards,
Shipment ID: [SHIPMENT_ID]
CHC`
              },
              tagging: "Delivery Related -> Delivery Executive Complaint -> DE Rude -> Misbehavior"
            },
            "Request for Delivery Rating": {
              script: "I understand your concern. You can rate the delivery executive in the app after delivery completion.",
              workflow: [
                "Guide customer to rate in app",
                "Explain rating system",
                "Note feedback for internal review"
              ],
              tagging: "Delivery Related -> DE Complaint -> Request for delivery rating"
            }
          }
        },

        "Marked Delivered Not Delivered (MDND)": {
          script: "I apologize for the confusion. Let me check what happened with your delivery immediately.",
          workflow: [
            "Apologize to customer",
            "Ask probing questions: Is address correct? Did you receive call from DE? Check doorstep? Check with family? Check society gate?",
            "Contact DE/Hub manager - take TAT and give TAT",
            "If no TAT, escalate ASAP",
            "Fill grievance in system"
          ],
          options: {
            "Customer Convinced to Wait": {
              email: {
                subject: "MDND - Customer Waiting for Delivery",
                to: "hub@licious.com",
                cc: "tlchc@licious.com, sme@licious.com",
                body: `Hi Team,

The customer contacted CHC and complained that the shipment was marked as delivered but he had not got the products yet. We are unable to establish any contact with Delivery Hero, request that you please prioritize and deliver the shipment as soon as possible.

Customer Registered phone number: [PHONE]
Shipment Id: [SHIPMENT_ID]

Regards,
CHC`
              }
            },
            "Customer Requests Refund": {
              email: {
                subject: "MDND - Refund Processed",
                to: "hub@licious.com",
                cc: "tlchc@licious.com, sme@licious.com",
                body: `Hi Team,

A customer contacted CHC and complained that the shipment was marked as delivered but he had not got the products yet. We have issued a complete refund for the customer as per their request; kindly notify the Delivery Hero not to deliver the product to the customer.

Customer Registered phone number: [PHONE]
Shipment Id: [SHIPMENT_ID]

Regards,
CHC`
              }
            }
          },
          tagging: "Delivery Related -> MDND -> Licious Delivery"
        },

        "Partial Order Received": {
          script: "I sincerely apologize that you received an incomplete order. Let me help you get the missing items immediately.",
          workflow: [
            "Apologize to customer",
            "Ask which product is missing",
            "Ask if they opened the box",
            "Contact DE/Hub manager/AM",
            "Take TAT if response, give TAT",
            "If no response, escalate ASAP"
          ],
          options: {
            "Customer Agrees to Wait": {
              email: {
                subject: "Partial Order - Missing Items Delivery",
                to: "hub@licious.com",
                cc: "tlchc@licious.com, sme@licious.com",
                body: `Hi Team,

A customer contacted CHC and complained that items in the order were missing. Customer wants those products, so please try to deliver them ASAP.

Customer Registered phone number: [PHONE]
Shipment Id: [SHIPMENT_ID]
Missing Products: [PRODUCT_LIST]

Regards,
CHC`
              }
            },
            "Customer Wants Refund": {
              email: {
                subject: "Partial Order - Refund Processed",
                to: "hub@licious.com",
                cc: "tlchc@licious.com, sme@licious.com",
                body: `Hi Team,

A customer contacted CHC and complained that items in the order were missing. We have issued a partial refund for the customer as per their request; kindly notify the Delivery Hero not to deliver the missing products to the customer.

Customer Registered phone number: [PHONE]
Shipment Id: [SHIPMENT_ID]
Missing Products: [PRODUCT_LIST]

Regards,
CHC`
              }
            }
          },
          tagging: "Delivery Related -> Partial Orders Delivered"
        },

        "Preferred Delivery Slot Not Available": {
          script: "I understand you're looking for a specific delivery slot. Let me check availability for you.",
          workflow: [
            "Check workbench for slot availability",
            "If available, help place order in preferred slot",
            "If not available, inform customer to choose different slot",
            "Suggest nearest available slots"
          ],
          tagging: "Delivery -> Preferred Delivery Slot Not Available"
        },

        "Request to Add Delivery Instructions": {
          options: {
            "Landmark Request": {
              script: "I'll make sure to update the landmark information for your delivery.",
              workflow: [
                "Collect landmark details from customer",
                "Check if landmark reflects in workbench",
                "If not reflecting, send email to hub",
                "If order is out for delivery, call DE directly"
              ],
              email: {
                subject: "Customer Landmark Request",
                to: "hub@licious.com",
                body: `Hi Team,

I would like to bring to your attention a customer request regarding a specific landmark for delivery: [LANDMARK]. The customer has provided additional landmark details to ensure accurate and timely delivery.

Please update the relevant records accordingly and ensure the delivery team is informed.

Thank you for your support.

Best regards,
Shipment Id: [SHIPMENT_ID]
CHC`
              },
              tagging: "Delivery Related -> Request to Add Delivery Instructions -> Landmark Provided"
            },
            "Special Instructions": {
              script: "I've noted your delivery instructions and will ensure they're communicated to the delivery team.",
              workflow: [
                "Note special instructions",
                "Add to delivery notes in system",
                "If urgent, call DE directly"
              ],
              tagging: "Delivery Related -> Request to Add Delivery Instructions"
            }
          }
        },

        "Wrong Product Delivered": {
          script: "I sincerely apologize for delivering the wrong product. This should not have happened.",
          workflow: [
            "Apologize to customer",
            "Confirm product label name",
            "Check in workbench",
            "If product is wrong, call DE/HUB/AM",
            "Ask for TAT and provide to customer",
            "Fill grievance"
          ],
          options: {
            "Customer Agrees for Replacement": {
              email: {
                subject: "Wrong Product Delivered - Replacement Required",
                to: "hub@licious.com",
                cc: "tlchc@licious.com",
                body: `Hi Team,

The customer contacted CHC and complained that wrong product was delivered. We are unable to establish any contact with Delivery Hero, request that you please prioritize and deliver the correct items as soon as possible.

Shipment Id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
              }
            },
            "Customer Requests Refund": {
              email: {
                subject: "Wrong Product Delivered - Refund Processed",
                to: "hub@licious.com",
                cc: "tlchc@licious.com",
                body: `Hi Team,

A customer contacted CHC and complained that wrong product was delivered. We have issued a refund for wrong product delivered as per customer request; kindly notify the Delivery Hero not to deliver the wrong product to the customer.

Shipment Id: [SHIPMENT_ID]
Actual Product: [CORRECT_PRODUCT]
Wrong Product: [WRONG_PRODUCT]

Regards,
CHC`
              }
            }
          },
          tagging: "Delivery Related -> Wrong Product Delivered"
        },

        "Early Delivery Complaint": {
          script: "I apologize if the delivery timing caused any inconvenience to you.",
          workflow: [
            "Apologize to customer",
            "Check scheduled delivery time vs actual delivery time",
            "Explain that early delivery is to ensure freshness",
            "Note feedback for improvement",
            "If customer was not available, arrange for redelivery or provide options"
          ],
          tagging: "Delivery Related -> Early Delivery Complaint"
        }
      };

      const data = {
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
                  workflow: [
                    "Ask customer if they ever activated DND from our side"
                  ],
                  options: {
                    "Yes - Customer Activated DND": {
                      workflow: [
                        "Send email to Technical team, cc tlchc, sme"
                      ],
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
                  workflow: [
                    "Send an email to technical team, CC tlchc, sme"
                  ],
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
}
,

            "Request to add/edit Phone no.": {
  script: "Apologies to the customer and guide them that we are not able to edit or add the phone number from our side.",
  workflow: [
    "Apologize to the customer",
    "Inform them we cannot add/edit the phone number from our end",
    "Guide them to add or edit the phone number directly in the app"
  ],
  notes: "Cx called and asked to add/edit the phone number. Guided them properly. Customer agreed.",
  tagging: "Account Related -> Request to add/edit Phone number"
}
,

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
,
          }
        },

        "Blank call / call drop / spam": {
          subgroups: {
            "Blank call/spam Email/Wrong Number": `Have a look on workbench ... is there any ongoing shipment (using customer number).
If there is no response from customer:
Give disclaimer 3 times (I will be forced to disconnect the call).
Cut and redial the call.

Tagging - Blank Call/Call Drop/Spam --> Blank Call / Spam Email / Wrong Number`,
            "Call Drop": `If there is any call drop, instantly call back to customer.
If customer not respond/busy, create ticket/process.

Tagging - SF tagging --> Blank call drop --> call drop`
          }
        },

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
      script: "Apologies to the customer and guide them that because of some operational issue the order got cancelled. Assure them it won’t happen again.",
      options: {
        "Customer Already Paid": {
          workflow: [
            "Guide customer that their amount is safe",
            "Inform refund timelines: Source account within 3–5 working days, Licious Cash within 24 hours"
          ],
          notes: "Cx called and complained that order was cancelled without prior notice. Guided them and assured it won’t happen in future. Customer agreed.",
          tagging: "Cancellation Related -> Order Cancelled Without Consent -> Licious Cancellation Complaints"
        },
        "Customer Didn’t Pay": {
          workflow: [
            "Apologize and assure that it won’t happen in the future orders"
          ],
          notes: "Cx called and complained that order was cancelled without prior notice. Guided them and assured it won’t happen in future. Customer agreed.",
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
        "Customer Didn’t Pay": {
          workflow: [
            "Apologize and assure that it won’t happen again in future orders"
          ],
          notes: "Cx called and complained that the order got cancelled without notification. Guided and assured that it will not happen in future. Customer agreed.",
          tagging: "Cancellation Related -> Order Cancelled Without Consent -> Customer Cancellation"
        }
      }
    }
  }
}
,

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
        "Customer Didn’t Agree with Reschedule": {
          workflow: [
            "Fill grievance and cancel the order as per customer’s request",
            "Initiate refund for the full amount"
          ],
          notes: "Cx called and asked why the order got rescheduled. Guided the customer that it was due to operational issues. Customer wanted to cancel — cancelled and refunded.",
          tagging: "Cancellation Related -> Licious Factor -> Order Reschedule"
        },
        "Reschedule Because CNR": {
          workflow: [
            "Guide the customer that it got rescheduled because our DE tried to contact them but due to no proper call connection, it got delayed",
            "Apologize for the inconvenience and assure that it won’t happen again"
          ],
          notes: "Cx called and asked why the order got rescheduled. Guided them and assured that it won’t happen again. Customer agreed.",
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
            "Cancel the entire order and initiate refund as per customer’s request"
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
          workflow: [
            "Take TAT from backend and share with customer"
          ],
          options: {
            "Customer Agrees": {
              notes: "Cx called and said the order is delayed. Called DE > HUB > AM, took TAT and shared it with the customer. Customer agreed.",
              tagging: "Order Tracking -> Order Tracking Outside SLA"
            },
            "Customer Disagrees": {
              workflow: [
                "Fill grievance and cancel the shipment",
                "Initiate full refund as per customer’s requirement"
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
          options : {
            "Customer Agrees": {
              workflow: [
                "Send escalation email to HUB (CC TLCHC, SME)"
              ],
              email: {
                "to": "HUB",
                "cc": "TLCHC, SME",
                "subject": "Delay in Delivery",
                "body": "Hi Team,\n\nThe customer reported that the shipment isn’t delivered yet and is already 30 minutes late. Please check and ensure delivery ASAP.\n\nShipment ID: [SHIPMENT_ID]\n\nRegards,\nCHC"
              },
              notes: "Cx called and said shipment is delayed. Called DE > HUB > AM, RNR. Customer agreed. Sent email to HUB for follow-up.",
              tagging: "Order Tracking -> Order Tracking Outside SLA"
            },
            "Customer Disagrees": {
              workflow: [
                "Fill grievance and cancel the shipment",
                "Initiate full refund as per customer’s request"
              ],
              notes: "Cx called and said shipment is delayed. Called DE > HUB > AM, RNR. Customer disagreed — cancelled and refunded.",
              tagging: "Cancellation Related -> Licious Factor -> Delay on Delivery"
            }
          }
        }
      }
    }
  }
}

,


            "Changed mind [ssi]": `Customer decided to cancel the entire order [he/she changed their mind] [cancel fee applies].

Tagging - Cancellation related --> customer factors --> change mind`,

            "Add/remove item": `We cannot add items; we only remove items and cancel [cancel fee applies].

Tagging - Cancellation related --> customer factors --> forgot to add/remove item`,

            "Forgot to apply coupon": `We can apply a coupon on behalf of customer [before billed]. After bill, if customer wants to cancel the order [cancel fee applies].

Tagging - Cancellation related --> customer factors --> forgot to apply coupon`,

            "Order got split": `The order already got split by the app. Now customer wants to cancel the order [before billed] [cancel fee applies].

Tagging - Cancellation related --> customer factors --> order split in different slot`,

            "Preferred slot unavailable": `Customer placed an order but wants to change it to a different slot which is not available [cancel fee applies].

Tagging - Cancellation related --> customer factors --> slot unavailable to reschedule`,

            "Customer Not available": `Customer is not available to take the order, so they cancel the order [cancel fee applies].

Tagging - Cancellation related --> customer factors --> not available to receive order`,

            "Chose a wrong Address": `Customer chose a wrong address by mistake; they cancel the order [cancel fee applies].

Tagging - Cancellation related --> customer factors --> chose a wrong address`,

            "Payment Failed": `Due to some technical issue, the payment failed [cancel fee applies].

Tagging - Cancellation related --> customer factors --> payment failed`,

            "Order Rescheduled [li]": `The order was rescheduled due to bandh, DE not available, hub infrastructure, etc. Apologies for inconvenience.

We regret to inform you this your order has been rescheduled to (new slot) due to unforeseen operational issues.

Our team tried to contact you to give reschedule information by call and SMS.

Tagging - cancellation related --> order cancellation licious factors`,

            "Order Modification[li]": `Imagine you ordered 2 chicken; one scheduled for today and one for tomorrow.

Check the reason for modification [Product OFS / Damaged cases]. If shipment is ongoing and customer wants to cancel due to order modification, cancel the entire order.

Tagging - cancellation related --> order cancellation licious factors --> order modification`,

            "Delivery is Delayed [li]": `If order got delayed and customer is asking "Where is my order?" Check status if "Processing / Accepted / Billed". Call hub or AM and escalate ASAP if no response.

If customer is not convinced with TAT, offer initial refund.

Tagging - cancellation related --> order cancellation licious factors --> delivery is delayed`
          }
        },

        "Customer Support Feedback" : {
          subgroups: {
            "Ambassador Appreciation": `Take the customer number.  
Thank the customer for the appreciation towards the ambassador.  
Inform the customer the appreciation will be shared.

Email to TL, SME and QA in cc of the mail.

Subject: Customer Appreciation for [Colleague's Name] as CHC Ambassador

hi team,

I wanted to inform you that during a recent call with a customer, they expressed their appreciation for [Colleague's Name] and commended their efforts as a CHC Ambassador.

It's great to see such positive recognition,

Regards,  
[Your Name]
CHC
SF tagging --> customer support feedback --> ambassador appreciation`,

            "CHC Ambassador Complain Related": `Take the customer number.  
Apologize and check the previous ambassador details.  
Inform the customer the necessary action will be taken and check what was the concern the customer was facing and provide the resolution accordingly.  
Collect the ambassador details.

Email team leader and assistant manager mentioning about the customer's feedback.

Subject: Customer Complaint Regarding CHC Ambassador

hi team,

I would like to bring to your attention that during a recent call, a customer raised a complaint concerning the conduct/performance of the CHC Ambassador. The customer expressed dissatisfaction with our service.

Best regards,  
[Your Name]  
CHC

SF tagging --> customer support feedback --> ambassador complain`
          }
        },

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

Regard,
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
                    "Apologize to the customer",
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

Regard,
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

Regard,
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

Regard,
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

Regard,
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
            },

            "Marked Delivered Not Delivered (MDND)": {
              script: "I apologize for the confusion regarding your delivery. Let me help you locate your order immediately.",
              workflow: [
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

Regard,
CHC`
              },
              notes: "Cx call and make complaint about early delivery. Apologize to customer and send mail to HUB",
              tagging: "Order Related -> Order Tracking -> Early Delivery Complaint"
            }
          }
        },

        "Order Tracking": {
          subgroups: {
            "Order Tracking - within SLA": `If order is not dispatched, do not call HUB/DE. Inform the customer that the order will be delivered as per regular ETA.

If dispatch, do not call HUB/DE. Inform the customer that it will be delivered as per regular ETA.

Tagging: Order Related -> Order Tracking ->`,

            "15 min before outside SLA": `If 15 mins still remain till end of delivery slot and order is not dispatched, inform the customer that the order is not dispatched and call the Hub.  
If call gets connected, take TAT and give TAT.

Else inform the customer that we can't give a TAT for now.

Send email HUB.

If order got dispatched, do not call Hub/DE; inform the order is dispatched and share the TAT seen on the workbench.

Send email HUB.

Tagging: Order Related -> Order Tracking ->`,

            "Order Tracking - outside SLA": `If order is still not dispatched, inform the customer that the order is still not dispatched. Call the HUB (if connected, take TAT and give TAT; if not connected, don't inform the customer and say we can't give TAT for now).

Send email HUB.

Else if order is dispatched, inform the customer order is dispatched. Call the DE (if response, take TAT and give TAT; if no response, we can't give TAT).

Send email HUB.`
          }
        },

        "Payment Related": {
          subgroups: {
            "COD/POD": `Apologies to customer and inform that we don't have Cash on Delivery. We are moving towards digital payment methods.

Tagging - payment related --> cod/pod related`,

            "Money Debited Order Not Placed": `Apologies to customer and check in workbench (payment method Razorpay/PTM/etc.).

Check in Razorpay if the payment is created (wait for 7 min), authorized, stuck in gateway (auto refunded in 10 mins), captured payment is received, failed payment got failed, refunded payment good refunded already.

Tagging - payment related -> money debited order not placed`,

            "Multiple payments": `Apologies to customer and check in workbench (then Razorpay) if double payment happened, initiate full refund form.

Tagging - payment related --> Multiple payments`,

            "Payment failed": `Apologies to customer and educate them that the payment failed, your money is safe and will be refunded in 24-48 hrs.

Tagging - payment related --> payments failed`,

            "Payment page too slow": `Apologies to customer and check if there is any issue from our side. Also mention to check net connectivity to customer.

Send email to - Tlchc

Payment issue:  
Customer's contact no:  
Issue:

Tagging - payment related --> Payment page too slow`,

            "Preferred payment mode not available": `Apologies to customer and provide them information that we have these online methods to pay, but take it as feedback and share with the relevant team.

Tagging - payment related --> Preferred payment mode not available`,

            "Payment link Request": `Apologies to customer and inform that we don't have payment link method for now, but take it as feedback and share with my team.

Tagging - payment related --> Preferred payment link`,

            "Wallet DE-link": `Apologies to customer and guide them to de-link other wallets from apps:

Amazon Pay --> Account --> Login at other apps --> Linked apps (remove it)

Tagging - payment related --> Wallet delink query`
          }
        },

        "Pricing & Billing Related": {
          subgroups: {
            "Extra Grammage Charge": `Inform the customer we don't charge for extra grammage.  
If customer paid online and received less grammage, check the invoice in workbench and refund the amount if customer is eligible.

Tagging - Pricing & Billing related --> Extra Grammage received`,

            "Grammage enquiry": `"The grammage difference is caused due to processing of the meat."  
At Licious, we have standard cuts and do not compromise on them.  
We may deliver more grammage but never less grammage.

If less grammage is delivered, we will process the extra charged amount to Licious cash wallet within 24hrs of delivery.

Salesforce ticket with tagging - Pricing & Billing related --> Grammage enquiry`,

            "Less Grammage received": `Apologies to the customer and with help of invoice educate them that if there is any less grammage received, it will auto refund to your Licious cash within 24 hr after delivery.

Tagging - Pricing & Billing related --> Less Grammage received`,

            "Inconsistency in price during checkout": `Apologies to the customer. Try ordering the same product (to check if there is any glitch on our side).  
Guide them to place the order and refund the extra amount to Licious cash with TL approval.

Send email - TL/SME

Subject: Inconsistency in price during checkout

Hi team,

A customer is facing price fluctuation issues during placing an order.

Shipment id:  
Product details:  
Attached image:  
Issue:

If extra charges exist like delivery charges, guide and inform customer accordingly.`,

            "Invoice Unclear": `Apologies to the customer and check in workbench if the amount has been charged correctly after discount.  
If customer wants invoice, send invoice.

If mismatch exists, after confirmation refund the extra amount customer paid.

Salesforce ticket with tagging - Pricing & Billing related --> Invoice unclear`,

            "Product too expensive": `Apologies for inconvenience.  
"I totally understand your concern sir... but we charge for actual product which is good in quality and hygiene.  
Licious meat is freshest; all products are steroid-free and chemical-free.  
We only charge for net weight, so price may appear a little expensive."

Salesforce ticket with tagging - Pricing & Billing related --> Product too expensive`,

            "Sudden increase in product price": `I understand your concern sir. Our prices remain competitive, with slight increase due to quality selection and local demand.  
We don't charge for wastage.  
But for now, I take it as feedback to be shared with the relevant team.`,

            "Unable to view/download Invoice": `Fetch the shipment ID (using mobile no.). If you can view the invoice, share it with the customer.  
Also guide the customer that from the app/web they can select "My Order" from the list of orders, select and view details, scroll below.

Salesforce ticket with tagging - Pricing & Billing related --> Unable to view/download invoice`
          }
        },

        "Product Quality": {
          subgroups: {
            "Cut Issues/Bone Meat Ratio/Size/Meatiness/Specification issue": `Apologies to the customer and try to understand their concern.

If complaint is about SMALL or LARGE pieces:
- Confirm total number of pieces received in that net weight; if it matches website description, it is the right product. Educate the customer accordingly.
- Confirm label details to ensure HUB has delivered the right product; if label is correct but pack has less/more pieces, it is a quality issue.

Bone Meat Ratio, bony & boneless pieces:
- Lamb & Goat meat bony: 70% bone-in, 30% boneless
- If post cooking, probe for cooking time (7+ whistles = overcooked)
- Hyderabad: 65% bone-in, 35% boneless

If complaint is about LESS number of pieces:
- Confirm label details and net weight.
- If mismatch, report GRIV & FIR in Workbench with product and damaged quantity details.`,

            "Cleanliness Issue/High Drip": `Apologies to the customer and try to understand their concern.

Product info:
- Blood drip or Fat/skin not trimmed: Educate customers skin on wings not completely trimmed for Chicken category.
- For first-time Licious customers, explain myoglobin causes red color.
- Prawns not deveined: only upper vein removed, lower vein safe to consume.

Raise Grievance in Workbench with category Cleanliness Issue.`,

            "Taste Issues": `Apologies to the customer and try to understand their concern.

Product info:
- Frozen meat texture will be hard.
- Chicken takes 20-25 minutes for cooking.
- Mutton takes 5-6 whistles.

Raise Grievance in Workbench with category Taste Issues.`,

            "Product Damage": `Product info:
- Marinades and Whole Chicken not vacuum packed.
- Fish & seafood loosely vacuum packed.
- Check Kebabs use within UBD and storage in chilled.
- Educate customer to use within Use By Date and follow cooking instructions.

Raise Grievance in Workbench with category Product Damaged.`,

            "Health Issues": `Apologies and ask:
- Did you consume the product before expiry?
- Did you notice any bad smell?

Fill grievance. If refund eligible, pitch for refund. Otherwise assure escalation.

Raise Grievance in Workbench with category Health Issues.`,

            "Contamination/Spoilage": `Apologies and arrange reverse pickup (except Kolkata).

Give refund based on refund type.

Raise Grievance in Workbench with category Contamination.

Send email to hub, cc city-quality, tlchc, sme:
Subject: PQ issue - Reverse Pickup [shipment id]
Body:
Please arrange reverse pickup.
Shipment Id:
SKU name:
Customer phone:`,

            "Discoloration/Appearance": `Product info:
- Confirm if discoloration observed before or after opening.
- Inform customer color variation can be breed-dependent.

Raise Grievance in Workbench with category Discoloration.`,

            "Expired Product/Shelf Life": `Please refer customer to the Shelf Life Chart below for product shelf life information.`,

            "Texture": `Apologies and ask customer to explain the texture concern.

If understanding issue, educate; else raise grievance.

Raise Grievance in Workbench with category Texture.`,

            "Packaging Damaged/Sealing Issues/Vacuum Loss/Labelling related": `Product info:
- Marinades and Whole Chicken not vacuum packed.
- Fish and Seafood loosely vacuum packed.

Raise Grievance in Workbench with category Packaging Damage.`,

            "Smell Issues/Freshness/Temperature": `If understanding issue, educate customer; else raise grievance.

Raise Grievance in Workbench with category Smell Issues.`
          }
        }
      };

      // Populate main groups dropdown
      function populateMainGroups() {
        mainGroupSelect.innerHTML = '<option value="">-- Select Main Group --</option>';
        Object.keys(data).forEach(mainGroup => {
          const option = document.createElement("option");
          option.value = mainGroup;
          option.textContent = mainGroup;
          mainGroupSelect.appendChild(option);
        });
        mainGroupSelect.style.display = "inline-block";
      }

      // Populate subgroups dropdown
      function populateSubGroups(mainGroup) {
        subGroupSelect.innerHTML = '<option value="">-- Select Sub Group --</option>';
        conditionalOptions.innerHTML = '';
        workflowOutput.innerHTML = '';
        instructionDiv.textContent = "";

        if (mainGroup && data[mainGroup]) {
          const subgroups = data[mainGroup].subgroups;
          Object.keys(subgroups).forEach(sub => {
            const option = document.createElement("option");
            option.value = sub;
            option.textContent = sub;
            subGroupSelect.appendChild(option);
          });
          subGroupSelect.style.display = "inline-block";
        } else {
          subGroupSelect.style.display = "none";
        }
      }

      // Display delivery workflow
      function displayDeliveryWorkflow(subGroup, workflow) {
        workflowOutput.innerHTML = '';

        // Check if workflow has ONLY options (no script/workflow at top level)
        if (workflow.options && !workflow.script && !workflow.workflow) {
          // Display only the options dropdown
          const optionsDiv = document.createElement('div');
          optionsDiv.className = 'conditional-dropdown';
          optionsDiv.innerHTML = `<h3>🔀 Please Select Scenario:</h3>`;

          const select = document.createElement('select');
          select.className = 'sidebar-input';
          select.innerHTML = '<option value="">-- Choose Option --</option>';

          Object.keys(workflow.options).forEach(optionKey => {
            const option = document.createElement('option');
            option.value = optionKey;
            option.textContent = optionKey;
            select.appendChild(option);
          });

          select.addEventListener('change', function () {
            const selectedOption = workflow.options[this.value];
            if (selectedOption) {
              displayConditionalWorkflow(selectedOption, this.value);
            }
          });

          optionsDiv.appendChild(select);
          workflowOutput.appendChild(optionsDiv);
          return;
        }

        // Display main script
        if (workflow.script) {
          const scriptSection = document.createElement('div');
          scriptSection.className = 'workflow-section';
          scriptSection.innerHTML = `
            <h3>📞 Customer Script</h3>
            <p>${workflow.script}</p>
            <button class="copy-btn" onclick="copyToClipboard('${workflow.script.replace(/'/g, "\\'")}')">Copy Script</button>
          `;
          workflowOutput.appendChild(scriptSection);
        }

        // Display workflow steps
        if (workflow.workflow) {
          const workflowSection = document.createElement('div');
          workflowSection.className = 'action-workflow';
          workflowSection.innerHTML = `
            <h3>⚙️ Action Workflow</h3>
            <ul>
              ${workflow.workflow.map(step => `<li>${step}</li>`).join('')}
            </ul>
          `;
          workflowOutput.appendChild(workflowSection);
        }

        // Display conditional options
        if (workflow.options) {
          const optionsDiv = document.createElement('div');
          optionsDiv.className = 'conditional-dropdown';
          optionsDiv.innerHTML = '<h3>🔀 Select Customer Response:</h3>';

          const select = document.createElement('select');
          select.className = 'sidebar-input';
          select.innerHTML = '<option value="">-- Choose Option --</option>';

          Object.keys(workflow.options).forEach(optionKey => {
            const option = document.createElement('option');
            option.value = optionKey;
            option.textContent = optionKey;
            select.appendChild(option);
          });

          select.addEventListener('change', function () {
            const selectedOption = workflow.options[this.value];
            if (selectedOption) {
              displayConditionalWorkflow(selectedOption, this.value);
            }
          });

          optionsDiv.appendChild(select);
          workflowOutput.appendChild(optionsDiv);
        }

        // Display email template
        if (workflow.email) {
          displayEmailTemplate(workflow.email);
        }

        // Display notes
        if (workflow.notes) {
          const notesSection = document.createElement('div');
          notesSection.className = 'workflow-section';
          notesSection.style.background = '#fff3e0';
          notesSection.style.borderLeft = '4px solid #ff9800';
          notesSection.innerHTML = `<strong>📝 Notes:</strong> ${workflow.notes}`;
          workflowOutput.appendChild(notesSection);
        }

        // Display tagging
        if (workflow.tagging) {
          const taggingSection = document.createElement('div');
          taggingSection.className = 'tagging-info';
          taggingSection.innerHTML = `<strong>🏷️ Tagging:</strong> ${workflow.tagging}`;
          workflowOutput.appendChild(taggingSection);
        }
      }

      // Display conditional workflow
      function displayConditionalWorkflow(workflow, optionName) {
        const existingConditional = document.getElementById('conditionalWorkflow');
        if (existingConditional) {
          existingConditional.remove();
        }

        const conditionalDiv = document.createElement('div');
        conditionalDiv.id = 'conditionalWorkflow';
        conditionalDiv.className = 'workflow-section';
        conditionalDiv.style.background = '#e8f5e9';
        conditionalDiv.style.borderLeft = '4px solid #4caf50';

        conditionalDiv.innerHTML = `<h3>✅ ${optionName}</h3>`;

        if (workflow.script) {
          conditionalDiv.innerHTML += `
            <p><strong>Script:</strong> ${workflow.script}</p>
            <button class="copy-btn" onclick="copyToClipboard('${workflow.script.replace(/'/g, "\\'")}')">Copy Script</button>
          `;
        }

        if (workflow.workflow) {
          conditionalDiv.innerHTML += `
            <div class="action-workflow">
              <h4>Workflow:</h4>
              <ul>
                ${workflow.workflow.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          `;
        }

        // Check if there are nested options
        if (workflow.options) {
          const nestedOptionsDiv = document.createElement('div');
          nestedOptionsDiv.style.marginTop = '15px';
          nestedOptionsDiv.innerHTML = '<h4>🔀 Select Next Action:</h4>';

          const nestedSelect = document.createElement('select');
          nestedSelect.className = 'sidebar-input';
          nestedSelect.innerHTML = '<option value="">-- Choose Option --</option>';

          Object.keys(workflow.options).forEach(optionKey => {
            const option = document.createElement('option');
            option.value = optionKey;
            option.textContent = optionKey;
            nestedSelect.appendChild(option);
          });

          nestedSelect.addEventListener('change', function () {
            const selectedNestedOption = workflow.options[this.value];
            if (selectedNestedOption) {
              displayNestedWorkflow(selectedNestedOption, this.value);
            }
          });

          nestedOptionsDiv.appendChild(nestedSelect);
          conditionalDiv.appendChild(nestedOptionsDiv);
        }

        if (workflow.email) {
          displayEmailTemplate(workflow.email, conditionalDiv);
        }

        if (workflow.notes) {
          conditionalDiv.innerHTML += `
            <div style="background: #fff3e0; padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #ff9800;">
              <strong>📝 Notes:</strong> ${workflow.notes}
            </div>
          `;
        }

        if (workflow.tagging) {
          conditionalDiv.innerHTML += `
            <div class="tagging-info">
              <strong>🏷️ Tagging:</strong> ${workflow.tagging}
            </div>
          `;
        }

        workflowOutput.appendChild(conditionalDiv);
      }

      // Display nested workflow (for options within options)
      function displayNestedWorkflow(workflow, optionName) {
        const existingNested = document.getElementById('nestedWorkflow');
        if (existingNested) {
          existingNested.remove();
        }

        const nestedDiv = document.createElement('div');
        nestedDiv.id = 'nestedWorkflow';
        nestedDiv.className = 'workflow-section';
        nestedDiv.style.background = '#e3f2fd';
        nestedDiv.style.borderLeft = '4px solid #2196f3';
        nestedDiv.style.marginTop = '15px';

        nestedDiv.innerHTML = `<h4>✅ ${optionName}</h4>`;

        if (workflow.script) {
          nestedDiv.innerHTML += `
            <p><strong>Script:</strong> ${workflow.script}</p>
            <button class="copy-btn" onclick="copyToClipboard('${workflow.script.replace(/'/g, "\\'")}')">Copy Script</button>
          `;
        }

        if (workflow.workflow) {
          nestedDiv.innerHTML += `
            <div class="action-workflow">
              <h5>Workflow:</h5>
              <ul>
                ${workflow.workflow.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          `;
        }

        if (workflow.email) {
          displayEmailTemplate(workflow.email, nestedDiv);
        }

        if (workflow.notes) {
          nestedDiv.innerHTML += `
            <div style="background: #fff3e0; padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #ff9800;">
              <strong>📝 Notes:</strong> ${workflow.notes}
            </div>
          `;
        }

        if (workflow.tagging) {
          nestedDiv.innerHTML += `
            <div class="tagging-info">
              <strong>🏷️ Tagging:</strong> ${workflow.tagging}
            </div>
          `;
        }

        document.getElementById('conditionalWorkflow').appendChild(nestedDiv);
      }

      // Display email template
      function displayEmailTemplate(email, container) {
        const emailSection = document.createElement('div');
        emailSection.className = 'workflow-section';

        let emailHTML = '<h3>📧 Email Template</h3>';
        emailHTML += `<div class="email-template">`;
        emailHTML += `<strong>Subject:</strong> ${email.subject}\n\n`;
        emailHTML += `<strong>To:</strong> ${email.to}\n`;
        if (email.cc) {
          emailHTML += `<strong>CC:</strong> ${email.cc}\n`;
        }
        emailHTML += `\n${email.body}`;
        emailHTML += `</div>`;

        const emailText = `Subject: ${email.subject}\nTo: ${email.to}\n${email.cc ? 'CC: ' + email.cc + '\n' : ''}\n${email.body}`;
        emailHTML += `<button class="copy-btn" onclick="copyToClipboard(\`${emailText.replace(/`/g, '\\`')}\`)">Copy Email</button>`;

        emailSection.innerHTML = emailHTML;

        if (container) {
          container.appendChild(emailSection);
        } else {
          workflowOutput.appendChild(emailSection);
        }
      }

      // Event handlers
      mainGroupSelect.addEventListener("change", () => {
        instructionDiv.textContent = "";
        workflowOutput.innerHTML = '';
        conditionalOptions.innerHTML = '';
        populateSubGroups(mainGroupSelect.value);
      });

      subGroupSelect.addEventListener("change", () => {
        const mainGroup = mainGroupSelect.value;
        const subGroup = subGroupSelect.value;
        instructionDiv.textContent = "";
        workflowOutput.innerHTML = '';
        conditionalOptions.innerHTML = '';

        if (mainGroup && subGroup) {
          const subgroupData = data[mainGroup].subgroups[subGroup];

          if (typeof subgroupData === 'object') {
            // For any subgroup that has structured workflow/script
            displayDeliveryWorkflow(subGroup, subgroupData);
          } else if (typeof subgroupData === 'string') {
            // For plain text SOPs
            instructionDiv.innerHTML = subgroupData
              .replace(/\[li\]/g, '<span class="li-factor">[li factor]</span>')
              .replace(/\[ssi\]/g, '<span class="customer-factor">[customer factor]</span>');
          }
        }

      });

      // Search functionality
      searchBox.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();

        if (searchTerm.length < 2) {
          instructionDiv.innerHTML = '';
          workflowOutput.innerHTML = '';
          return;
        }

        let results = [];

        // Search through all data
        Object.keys(data).forEach(mainGroup => {
          Object.keys(data[mainGroup].subgroups).forEach(subGroup => {
            const content = data[mainGroup].subgroups[subGroup];
            const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

            if (subGroup.toLowerCase().includes(searchTerm) ||
              contentStr.toLowerCase().includes(searchTerm)) {
              results.push({
                mainGroup: mainGroup,
                subGroup: subGroup,
                content: content
              });
            }
          });
        });

        // Display search results
        if (results.length > 0) {
          instructionDiv.innerHTML = `<h3>🔍 Search Results (${results.length} found):</h3>`;

          results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'script-block';
            resultDiv.style.cursor = 'pointer';
            resultDiv.innerHTML = `
              <h4>${result.mainGroup} → ${result.subGroup}</h4>
              <p style="font-size: 13px; color: #666;">Click to view full details</p>
            `;

            resultDiv.addEventListener('click', () => {
              mainGroupSelect.value = result.mainGroup;
              populateSubGroups(result.mainGroup);
              subGroupSelect.value = result.subGroup;

              // Trigger the change event
              const event = new Event('change');
              subGroupSelect.dispatchEvent(event);

              // Clear search
              searchBox.value = '';
            });

            instructionDiv.appendChild(resultDiv);
          });
        } else {
          instructionDiv.innerHTML = '<p style="color: #e74c3c;">No results found. Try different keywords.</p>';
        }
      });

      // Initialize dropdowns
      populateMainGroups();

      // ==================== EGG DAMAGE CALCULATOR ====================

      document.getElementById('calculateBtn').addEventListener('click', function () {
        const orderValue = parseFloat(document.getElementById('orderValue').value);
        const packageOption = parseInt(document.getElementById('packageOption').value);
        const damagedEggs = parseInt(document.getElementById('damagedEggs').value);
        const resultDiv = document.getElementById('calc-result');

        // Validation
        if (isNaN(orderValue) || orderValue <= 0) {
          resultDiv.innerHTML = '<span style="color: #e74c3c;">⚠️ Please enter a valid order value</span>';
          return;
        }

        if (isNaN(damagedEggs) || damagedEggs < 0) {
          resultDiv.innerHTML = '<span style="color: #e74c3c;">⚠️ Please enter a valid number of damaged eggs</span>';
          return;
        }

        if (damagedEggs > packageOption) {
          resultDiv.innerHTML = `<span style="color: #e74c3c;">⚠️ Damaged eggs (${damagedEggs}) cannot exceed package size (${packageOption})</span>`;
          return;
        }

        // Calculate refund based on exact logic
        let refundAmount = 0;

        if (packageOption === 6) {
          refundAmount = damagedEggs >= 1 ? orderValue : 0;
        } else if (packageOption === 12) {
          refundAmount = damagedEggs < 6 ? orderValue / 2 : orderValue;
        } else if (packageOption === 30) {
          if (damagedEggs < 6) refundAmount = (orderValue / 30) * 6;
          else if (damagedEggs < 12) refundAmount = (orderValue / 30) * 12;
          else if (damagedEggs < 18) refundAmount = (orderValue / 30) * 18;
          else if (damagedEggs < 24) refundAmount = (orderValue / 30) * 24;
          else refundAmount = orderValue;
        }

        refundAmount = Math.min(refundAmount, orderValue);

        // Display result
        resultDiv.innerHTML = `
          <div style="color: #27ae60;">
            <strong>✅ Refund Calculated</strong><br><br>
            <strong>Package:</strong> ${packageOption} Eggs<br>
            <strong>Order Value:</strong> ₹${orderValue.toFixed(2)}<br>
            <strong>Damaged Eggs:</strong> ${damagedEggs}<br><br>
            <strong style="font-size: 18px; color: #e74c3c;">💰 Refund Amount: ₹${refundAmount.toFixed(2)}</strong>
          </div>
        `;
      });

      // ==================== KEYBOARD SHORTCUTS ====================

      document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchBox.focus();
        }

        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchBox) {
          searchBox.value = '';
          instructionDiv.innerHTML = '';
          workflowOutput.innerHTML = '';
        }
      });

      // ==================== RECENT HISTORY (In-Memory) ====================

      let recentlyViewed = [];
      const maxRecentItems = 5;

      function addToRecent(mainGroup, subGroup) {
        const item = { mainGroup, subGroup, timestamp: Date.now() };

        // Remove duplicates
        recentlyViewed = recentlyViewed.filter(
          i => !(i.mainGroup === mainGroup && i.subGroup === subGroup)
        );

        // Add to beginning
        recentlyViewed.unshift(item);

        // Keep only last 5
        if (recentlyViewed.length > maxRecentItems) {
          recentlyViewed = recentlyViewed.slice(0, maxRecentItems);
        }

        updateRecentView();
      }

      function updateRecentView() {
        const existingRecent = document.getElementById('recentSection');
        if (existingRecent) {
          existingRecent.remove();
        }

        if (recentlyViewed.length === 0) return;

        const recentSection = document.createElement('div');
        recentSection.id = 'recentSection';
        recentSection.style.marginTop = '30px';
        recentSection.innerHTML = '<h2>📚 Recently Viewed</h2>';

        recentlyViewed.forEach(item => {
          const recentBlock = document.createElement('div');
          recentBlock.className = 'script-block';
          recentBlock.style.cursor = 'pointer';
          recentBlock.innerHTML = `
            <strong>${item.mainGroup}</strong> → ${item.subGroup}
            <br><small style="color: #999;">${new Date(item.timestamp).toLocaleTimeString()}</small>
          `;

          recentBlock.addEventListener('click', () => {
            mainGroupSelect.value = item.mainGroup;
            populateSubGroups(item.mainGroup);
            subGroupSelect.value = item.subGroup;

            const event = new Event('change');
            subGroupSelect.dispatchEvent(event);

            // Scroll to top
            document.getElementById('mainContent').scrollTop = 0;
          });

          recentSection.appendChild(recentBlock);
        });

        document.getElementById('sidebar').appendChild(recentSection);
      }

      // Track viewed SOPs
      const originalSubGroupHandler = subGroupSelect.onchange;
      subGroupSelect.addEventListener('change', function () {
        const mainGroup = mainGroupSelect.value;
        const subGroup = subGroupSelect.value;

        if (mainGroup && subGroup) {
          addToRecent(mainGroup, subGroup);
        }
      });

      // ==================== ADDITIONAL CALCULATORS ====================

      // Refund Calculator Section
      
      document.getElementById('sidebar').insertBefore(
        document.getElementById('sidebar').children[2],
      );

      // Refund type change handler
      document.getElementById('refundType').addEventListener('change', function () {
        const partialSection = document.getElementById('partialSection');
        partialSection.style.display = this.value === 'partial' ? 'block' : 'none';
      });

      // Calculate refund
      document.getElementById('calculateRefundBtn').addEventListener('click', function () {
        const orderValue = parseFloat(document.getElementById('refundOrderValue').value);
        const refundType = document.getElementById('refundType').value;
        const refundPercentage = parseFloat(document.getElementById('refundPercentage').value);
        const resultDiv = document.getElementById('refund-result');

        if (isNaN(orderValue) || orderValue <= 0) {
          resultDiv.innerHTML = '<span style="color: #e74c3c;">⚠️ Please enter a valid order value</span>';
          return;
        }

        let refundAmount = 0;

        if (refundType === 'full') {
          refundAmount = orderValue;
        } else {
          if (isNaN(refundPercentage) || refundPercentage < 0 || refundPercentage > 100) {
            resultDiv.innerHTML = '<span style="color: #e74c3c;">⚠️ Please enter a valid percentage (0-100)</span>';
            return;
          }
          refundAmount = (orderValue * refundPercentage) / 100;
        }

        resultDiv.innerHTML = `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <strong>Order Value:</strong> ₹${orderValue.toFixed(2)}<br>
            <strong>Refund Type:</strong> ${refundType === 'full' ? 'Full Refund' : `Partial (${refundPercentage}%)`}<br>
            <strong style="font-size: 16px; color: #27ae60;">💰 Refund Amount: ₹${refundAmount.toFixed(2)}</strong>
          </div>
        `;
      });
    }