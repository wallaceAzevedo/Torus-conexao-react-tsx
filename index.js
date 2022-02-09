// ariquvo de conexão com MEtamask e Torus, se o arquivo for TSX quebra o Torus provider, se o arquivo e js para de renderizar na tela
import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Box, Flex, Text, Center } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import React, { useEffect, useState } from 'react'
import { Input } from '..'
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

import { useRouter } from 'next/router'

import torus from '../../../public/torus.png'
import metamask from '../../../public/metamask.png'

export function ConectWalletModal({ onClose }) {
  const [isConnected, setConnectedStatus] = useState(false)
  const [status, setStatus] = useState('')
  const [walletAddress, setWallet] = useState('')
  const [account, setAccount] = useState();

  const connectWalletPressed = async () => {
    if (isConnected) {
      
    }
    const walletResponse = await connectWallet()
    setConnectedStatus(walletResponse.connectedStatus)
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const address = await window.ethereum.enable()
        const obj = {
          connectedStatus: true,
          status: 'Conectado',
          address: address
        }
        return obj
      } catch (error) {
        return {
          connectedStatus: false,
          status: 'Erro durante a conexão com a conta'
        }
      }
    } else {
      return {
        connectedStatus: false,
        status: 'Instale a Metamask no seu browser: https://metamask.io/download.html'
      }
    }
  }

  const onClickLogin = async (e) => {
    e.preventDefault();

    const torus = new Torus({});
    await torus.init({
      enableLogging: false,
    });
    await torus.login();

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance });
  };

  return (
    <>
      <Box w="100%" m="0 auto">
        <Text fontSize="20px" textAlign="center">
          Conecte a sua carteira!
        </Text>
        <Box mt="32px" w="100%">
          <Button
            onClick={onClickLogin}
            transition="all 500ms"
            borderRadius="10px"
              m="0 auto"
            height="100%"
            p="10px"
            w="100%"
            border="1px solid #dfdfdf"
            bg="0"
            
            _focus={{
              outline: '0',
              boxShadow: 'inherit',
            }}
            _hover={{
              bg: '#efeff3',
            }}
            display="block"
          >
            <Center mt="7px" flexDirection="column">
              <Image
                  src={torus.src}
              />
              <Text fontWeight="bold" fontSize="27px" mt="10px" color="#000000" >
                Torus
              </Text>
              <Text fontWeight="medium" color="#717171" fontSize="18px" mt="10px">
                Conecte-se com sua conta Torus
              </Text>
            </Center>
          </Button>
      {connectWalletPressed && (
          <Button
            onClick={connectWalletPressed}
            transition="all 500ms"
            borderRadius="10px"
            m="0 auto"
            mt="20px"
            height="100%"
            p="10px"
            w="100%"
            border="1px solid #dfdfdf"
            bg="0"
            _focus={{
              outline: '0',
              boxShadow: 'inherit',
            }}
            _hover={{
              bg: '#efeff3',
            }}
            display="block"
          >
            <Center mt="7px" flexDirection="column" w="100%">
              <Image
                  src={metamask.src}
              />
              <Text fontWeight="bold" fontSize="27px" mt="10px" color="#000000" >
                MetaMask
              </Text>
              <Text fontWeight="medium" color="#717171" fontSize="18px" mt="10px">
                Conecte-se a sua carteira MetaMask
              </Text>
            {isConnected &&
              <Flex>
                <Text color="#0c0808" mt="5px">
                {' Staus ' +status}
                </Text>
              </Flex>
            }
            </Center>
          </Button>
      )}
        </Box>
        
      </Box>
    </>
  )
}
