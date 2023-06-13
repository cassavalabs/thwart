'use client';

import { Web3Status } from '@app/components/Web3Status';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isAddress } from '@ethersproject/address';
import { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';
import { useDesiredChain } from '@app/hooks';
import { Logo } from '@app/components/Logo';

const Loader = () => {
  return (
    <Box p="2rem">
      <HStack w="full" justifyContent="center">
        <Spinner color="blue.500" boxSize="100px" speed="0.5s" />
      </HStack>
    </Box>
  );
};

const AuthzTable = dynamic(() => import('@app/components/Table/AuthzTable'), {
  ssr: false,
  loading: () => <Loader />,
}) as any;
const ERC20Table = dynamic(() => import('@app/components/Table/ERC20Table'), {
  ssr: false,
  loading: () => <Loader />,
}) as any;
const GAuthzTable = dynamic(() => import('@app/components/Table/GAuthzTable'), {
  ssr: false,
  loading: () => <Loader />,
}) as any;
const NftTable = dynamic(() => import('@app/components/Table/NftTable'), {
  ssr: false,
  loading: () => <Loader />,
}) as any;

export default function HomeView() {
  useDesiredChain();
  const [search, setSearch] = useState<string>('');
  const { account } = useWeb3React();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const type = parseInt(searchParams.get('type') ?? '');
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  const setType = (type: string) => {
    urlSearchParams.set('type', type);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const submitSearch = () => {
    if (!isAddress(search)) return;

    urlSearchParams.set('search', search);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  useEffect(() => {
    if (account) {
      setSearch(account.toLowerCase());
    }
  }, [account]);

  return (
    <Container maxWidth="1400px" centerContent>
      <Box py="3rem">
        <VStack spacing={5}>
          <Box position="relative" w="12rem" h="3rem">
            <Logo />
          </Box>
          <Text maxWidth="30rem">
            Review and revoke authorizations and approvals granted to dApps or
            accounts on the Evmos blockchain.
          </Text>
          <InputGroup size="lg">
            <Input
              placeholder="Search by contract, owner or spender Address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              <Button
                variant="primary"
                w="3rem"
                h="3rem"
                borderStartRadius={0}
                isDisabled={!isAddress(search)}
                onClick={submitSearch}
              >
                <BsSearch size={32} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </VStack>
      </Box>
      <Flex w="full" flexDirection="column">
        <Web3Status />
        <Box my="1.5rem">
          <Card variant="outline" borderRadius="xl" minH="16rem">
            <CardHeader>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => setType('1')}
                  isActive={type === 1}
                >
                  AuthZ
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setType('3')}
                  isActive={type === 3}
                >
                  ERC-20
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setType('2')}
                  isActive={type === 2}
                >
                  G-AuthZ
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setType('4')}
                  isActive={type === 4}
                >
                  NFT
                </Button>
              </HStack>
            </CardHeader>
            {type === 1 ? (
              <AuthzTable />
            ) : type === 2 ? (
              <GAuthzTable />
            ) : type === 3 ? (
              <ERC20Table />
            ) : type === 4 ? (
              <NftTable />
            ) : (
              ''
            )}
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
