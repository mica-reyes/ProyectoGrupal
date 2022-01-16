

import {LOG, LOGOUT, DATA_HARD, GET_DATA_USER, TOKENS_HARD, ADD_FOUNDS, DEPOSIT_TRANSACTION, RETRIEVE_TOKEN, LOADING_FALSE, GET_TOKENS} from "./actions"

const initialState={
   Log: false,
   isLoading: true,
   userToken: null,
   userData:{
        
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    pin: "",
    transactions:[],
  
    balance:"0"
    },
    tokens:{
    }
   


}

const rootReducer = (state = initialState, action)=>{

    switch(action.type){
       case LOG:
           return {
               ...state,
               userToken: action.payload,
               isLoading: false,
               Log: true,
           }
        case LOGOUT:
            return {
                ...state,
                isLoading:false,
                userToken: null,
                Log: false,
            }
        case RETRIEVE_TOKEN:
            return {
                ...state,
                userToken: action.payload,
                isLoading: false,
            }
        case LOADING_FALSE:
            return {
                ...state,
                isLoading:false,
            }

            case GET_DATA_USER:

                const {firstname,lastname,email,pin,password,phone} = action.payload
                return {...state, userData: {
                                    firstname: firstname,
                                    lastname: lastname,
                                    email: email,
                                    pin: pin,
                                    password:password,
                                    phone:phone,
                                    balance: state.userData.balance,
                                    transactions: state.userData.transactions
                                    }}

            case GET_TOKENS:
            
            
                return {...state, tokens:action.payload};
                             

            case ADD_FOUNDS:
                return{...state, userData:{...state.userData, balance: parseInt(state.userData.balance) + parseInt(action.payload)}}
      
           case DEPOSIT_TRANSACTION:
             let aux = state.userData.transactions;
             aux.unshift(action.payload)
               return {...state, userData:{...state.userData, transactions: aux}}
       default: return state 
    }

};

export default rootReducer;
