import React, { useEffect, useState } from 'react'
import {useParams, Route} from 'react-router-dom'
import "./payment.css"
import DropIn from "braintree-web-drop-in-react";



function StudentPaymentCard(props) {  

    let studentId = useParams().id;
    
    const [instance, setInstance] = useState(null)
    const [lessons, setLessons] = useState(null)
    const [student, setStudent] = useState(null)
    const [error, setError] = useState(null)
   
    

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + "/payment/" + studentId, {
            headers: { Authorization: "Bearer " + props.teacherToken },
          })
        .then((res, req) => {
            if(res.status === 404){
                setError(404)
                throw new Error('Student not found')
            }
            if(res.status === 500){
                setError(500)
                throw new Error('Internal server error')
            }
            if(res.status === 200){
                return res.json()
            }
        }).then((res) => {
            setLessons(res)
        }).catch((e) => {
            console.log(e)
        })
    
        fetch(process.env.REACT_APP_SERVER_URL + "/student/" + studentId, {
            headers: { Authorization: "Bearer " + props.teacherToken },
        })
        .then((res, req) => {
            return res.json()
        })
        .then((res) => {
            setStudent(res);
        })
    })

    

    const total = lessons !== null ? lessons.length * 30 : 0;
    const name = student !== null ? student.name : null;
    const amt = lessons !== null ? lessons.length : 0

    async function onPay(e) {
        e.preventDefault()
        
        if(instance === null) {
            alert('no payment instance')
            return
        }
       
        instance.requestPaymentMethod(async (err, payload) => {
            if(err) {
                alert(err);
                return;
            }

            const body = JSON.stringify({student, nonce: payload});
            

            await fetch(process.env.REACT_APP_SERVER_URL + "/payment/" + studentId, {
                headers: { Authorization: "Bearer " + props.teacherToken,
                "Content-Type": "application/json"  },
                method: 'POST',
                body,      
                
                }).then((res, req) => {
                    return res.json()
                }).then((res) => {
                   
                })
            

        })
        
       
    
    }

    if(error !== null) {
        return <div>{error}</div>
    }
    
    
    return <div className="content wide-content">
        <form className="payment-form">
            <label>{name}</label>
            <br />
            <br />
            <div>{amt} lessons this month. 30$ each</div>
            <div>Total: ${total}</div>
            <br />
            <br />
            
            <DropIn
            options={{ authorization: process.env.REACT_APP_BRAINTREE_TOKENIZATION_KEY }}
            onInstance={(inst) => {
                if(instance === null) {
                    setInstance(inst);
                }                
            }}
            onError={(err) => {
                alert(err)
            }}
            />
            <button className="content-button" onClick={onPay}>Sign-up</button>
            </form>
    </div>
}

function TeacherPaymentCard(props) {
    return <div>Not yet implemented.</div>;
}

export default function PaymentView(props) {
    
    return <div>
        <Route path="/payment/:id">
            <StudentPaymentCard
                teacher={props.teacher}
                teacherId={props.teacherId}
                teacherToken={props.teacherToken}
            />
        </Route>
        <Route path="/payment" exact>
            <TeacherPaymentCard
                teacher={props.teacher}
                teacherId={props.teacherId}
                teacherToken={props.teacherToken}
            />
        </Route>
    </div>
}