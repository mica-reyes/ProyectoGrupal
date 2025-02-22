import * as React from 'react';
import { useState } from 'react';
import io from "socket.io-client";
import {useFocusEffect } from '@react-navigation/native';
import {IP_HOST} from "@env"
import {

  Box,
  
  Stack,Text,
  ChevronLeftIcon,
  InputGroup,
  Input,
  InputLeftAddon,
  Button,
  VStack,
  ZStack,
  Modal,
  FormControl,
  useToast,
  HStack

  
} from 'native-base';

import { Pressable} from 'react-native';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validateFunds } from '../../Utils/Utils';


export default function Sell({route, navigation}) {
  const windowHeight = Dimensions.get("screen").height
      const {currency, amount} = route.params
      const [loading, setLoading] = useState("")
      const toast = useToast()
      const [disabledButton, setDisableButton] = useState(true)
      const [disabledMont, setDisableMont] = useState(true)
      const [showModal, setShowModal] = useState(false)
      const blockChain = useSelector(state => state.blockChain);
      const [urlBlockChain, setUrlBlockChain]= useState("");
      const [founds, setFounds] = useState("0.00");
    
      const [mes, setMes] = useState("")
      
      React.useEffect(()=>{

        if(blockChain === "stellar"){
          setUrlBlockChain("stellar")
        }
        else if(blockChain === "ethereum"){
  
          setUrlBlockChain("ethereum");
        }
  
  
      },[blockChain])

      React.useEffect(()=>{

       if(parseFloat(amount) > 0){

        setDisableMont(false)

       }else{
        setDisableMont(true)
       }
  
  
      },[])






async function transferUser (){
  toast.show({
    title: "Selling...",
    placement: "top"

  })

  setLoading(true)

    if(blockChain === "stellar"){
        
  try {
   
    const response = await axios({
      method: "post",
      data: {
        sellCurrency:currency,
        sellAmount: founds
  
      },
      withCredentials: true,
      url: `http://${IP_HOST}:3001/operation/${urlBlockChain}/sell`,
    });
    setLoading(false)
    toast.show({
      title: response.data,
      placement: "bottom"

    })
    setTimeout(()=>navigation.popToTop(),1000)

  } catch (error) {
    toast.show({
      title: "Error",
      placement: "bottom"

    })
   
    
  } 


      }
      else if(blockChain === "ethereum"){
     
        try {
       
         const response = await axios({
            method: "post",
            data: {
              currency:currency,
              amount: founds
        
            },
            withCredentials: true,
            url: `http://${IP_HOST}:3001/operation/${urlBlockChain}/sell`,
          });
          setLoading(false)
          toast.show({
            title: response.data,
            placement: "bottom"
      
          })
          setTimeout(()=>navigation.navigation.popToTop(),1000)
      
        } catch (error) {
          toast.show({
            title: "Error",
            placement: "bottom"
      
          })
        }
         
        
      }






}


React.useEffect(()=>{

      
  setMes("")
  if( validateFunds(founds)){

    if(parseFloat(founds) > 0){
      if(parseFloat(founds)<= parseFloat(amount) ){

        setMes("")
        setDisableButton(false)
         
      }else{
   
        setDisableButton(true)
        setMes(`Insufficient ${currency}`)
      }

    }else{
      setMes("")

    }
   
 }else{
    setDisableButton(true)
    setMes("Please write a valid amount ")
  }
 


},[founds])






    return (
      <>    
      {/* Componente amount y button go back */}
      <Box bg="theme.100"
      height={windowHeight}
      >

          <Box
         mt="20"
          py="1"
         mb="2"
          rounded="xl"
          alignSelf="center"
          width={375}
          maxWidth="100%"
          bg="theme.200"
          
         
          >

          <Stack direction="row" alignItems="center" rounded="md">
          <Pressable   onPress={()=> navigation.goBack()}>
          <ChevronLeftIcon color="theme.150" size="9"/>
          </Pressable>
          <VStack>
          <Text ml="70px" fontSize="xl" color="theme.100" fontWeight="bold"  >Amount available </Text> 
             
          </VStack>
             
          </Stack>
          <VStack alignSelf="center">
          
          <Text color="#ffffff" ml="60px" mt="-3" fontWeight="bold"  fontSize="4xl"> {amount} </Text>
          <Text ml="200px" mt="-5" fontSize="xl"  color="theme.150" fontWeight="bold" >{currency} </Text> 
          </VStack>
          
          </Box>
         {/* Currency and amount */}
         
         <Box alignSelf="center" alignItems="center" >
          
          <Box
       
          py="1"
         
          alignItems="center"
          rounded="xl"
          alignSelf="center"
          width={375}
          maxWidth="100%"
          bg="theme.150"
          
          
         
          >

          <Text color="#ffffff" fontWeight="bold" fontSize="lg" pb="1">
            Amount to sell from {currency}:
            </Text>
          <Text color="#ffffff" mt="-3"fontWeight="bold" fontSize="4xl"> {founds} </Text>
         
            
       </Box>

     
       <Box
          mt="10px"
          py="1"
          mb="5"
          alignItems="center"
          rounded="xl"
          alignSelf="center"
          width={375}
          maxWidth="100%"
          bg="theme.300"
           >

          <Text color="#ffffff" mt="2" fontWeight="bold" fontSize="lg" pb="1">
            Your new {currency} amount will be: :
            </Text>
          <Text color="#ffffff" fontWeight="bold" fontSize="4xl"> {(parseFloat(amount) - parseFloat(founds)).toFixed(4) } </Text>
      
      </Box>
     
   
      <HStack alignSelf="center">
      <Button variant="outline" colorScheme="theme"  isDisabled={disabledMont} rounded="lg" px="7" py="1"  onPress={() => setShowModal(true)}>
        <Text color="#ffffff" fontSize="2xl"  >Mont</Text></Button>
        <Button variant="outline" colorScheme="theme" isLoading={loading} ml="2"rounded="lg" px="7"  py="1" isDisabled={disabledButton} onPress={() => transferUser()}>
        <Text color="#ffffff" fontSize="2xl" >Confirm</Text></Button>
      </HStack>
      <Text color="theme.300">{mes}</Text>
          </Box>
      
          </Box>
        
         

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="500px">
            <Modal.CloseButton />
            <Modal.Header>Amount to sell</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>How much {currency} do you want to sell?</FormControl.Label>
                
                <InputGroup
                  width={{
                    base: "70%",
                    md: "285",
                  }}
                >
                  <InputLeftAddon children={"$"} />
                  <Input
                    width={{
                      base: "70%",
                      md: "100%",
                    }}
                    placeholder="Amount"
                    onChangeText={setFounds}
                  />
                  

                </InputGroup>
                
               
              </FormControl>

            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false)
                    
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                   setShowModal(false)
             

                   
                  }}
                >
                  Confirm
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

     
      </>
  
 
  );
}
