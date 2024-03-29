import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Button,
  CardBody,
  CardFooter,
  HStack,
  Icon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FaRegFileAlt, FaUnlink } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { ApiResponse, Approval } from '@app/types';
import { useSearchParams } from 'next/navigation';
import { isAddress } from '@ethersproject/address';
import { Tooltip } from '../Tooltip';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from '@ethersproject/units';
import { formateDate } from '@app/utils';
import { useExplorer } from '@app/hooks';
import RevokeModal from '../RevokeModal';

export default function GAuthzTable() {
  const searchParams = useSearchParams();
  const type = Number(searchParams.get('type'));
  const search = String(searchParams.get('search'));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approvals, setApprovals] = useState<ApiResponse | null>(null);
  const [revoke, setRevoke] = useState<Approval | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useWeb3React();
  const { getExplorerUrl } = useExplorer();

  useEffect(() => {
    const request = async () => {
      if (type && type === 2 && isAddress(search)) {
        setIsLoading(true);
        const res = await fetch(`/api?type=${type}&search=${search}`);
        const result = await res.json();

        if (result.data) {
          setApprovals(result.data);
        }
        setIsLoading(false);
      }
    };

    request();
  }, [search, type]);

  const noRecords =
    (approvals && approvals.docs.length === 0 && !isLoading) || !approvals;

  return (
    <>
      <CardBody>
        <Text mb="1rem">
          A total of {approvals?.totalDocs ?? 0} dApp Generic Authorizations
          found
        </Text>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Contract</Th>
                <Th>Approved Spender</Th>
                <Th>Methods</Th>
                <Th>Allowance</Th>
                <Th>Updated At</Th>
                <Th>Transaction Hash</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {approvals?.docs?.map(({ contract, operator, ...approval }) => {
                const name = contract?.name || approval.contractAddress;
                const spender = operator?.name || approval.spender;
                const date = approval.dateApproved
                  ? formateDate(approval.dateApproved)
                  : null;
                const value = BigInt(approval.values ? approval.values[1] : 0);
                const allowance = Number.isSafeInteger(value)
                  ? formatUnits(value, contract?.decimals || 18)
                  : 'Unlimited';

                const canRevoke = () => {
                  if (!account) return false;
                  return account.toLowerCase() === approval.owner;
                };

                return (
                  <Tr key={approval.transactionHash}>
                    <Td>
                      <Link
                        href={getExplorerUrl(
                          'account',
                          approval.contractAddress
                        )}
                        target="_blank"
                        textDecoration="none !important"
                      >
                        <Tooltip label={name}>
                          <Text variant="textLink">{name}</Text>
                        </Tooltip>
                      </Link>
                    </Td>
                    <Td>
                      <Link
                        href={getExplorerUrl('account', approval.spender)}
                        target="_blank"
                        textDecoration="none !important"
                      >
                        <Tooltip label={spender}>
                          <HStack>
                            <Icon as={FaRegFileAlt} />
                            <Text variant="textLink">{spender}</Text>
                          </HStack>
                        </Tooltip>
                      </Link>
                    </Td>
                    <Td>
                      <Tooltip label={approval.methods?.join('|') ?? ''}>
                        <Text variant="textLink">
                          {approval.methods?.join('|')}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text>{allowance}</Text>
                    </Td>
                    <Td>
                      <Text>{date}</Text>
                    </Td>
                    <Td>
                      <Link
                        href={getExplorerUrl('tx', approval.transactionHash)}
                        target="_blank"
                        textDecoration="none !important"
                      >
                        <Tooltip label={approval.transactionHash}>
                          <Text variant="textLink">
                            {approval.transactionHash}
                          </Text>
                        </Tooltip>
                      </Link>
                    </Td>
                    <Td>
                      <Tooltip label="Connect the owner's wallet to revoke">
                        <Button
                          variant="primary"
                          isDisabled={!canRevoke()}
                          leftIcon={<FaUnlink />}
                          onClick={() => {
                            setRevoke(approval);
                            onOpen();
                          }}
                        >
                          Revoke
                        </Button>
                      </Tooltip>
                    </Td>
                  </Tr>
                );
              })}
              {noRecords && (
                <Tr>
                  <Td colSpan={6}>
                    <Box bg="yellow.800" py="0.5rem">
                      <Text textAlign="center" fontWeight={500}>
                        No dApp Generic-authorization found for address
                      </Text>
                    </Box>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
      <CardFooter>
        <HStack>
          <Text color="gray.400" whiteSpace="nowrap">
            Show rows:{' '}
          </Text>
          <Select size="sm" defaultValue={30}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </HStack>
      </CardFooter>
      <RevokeModal isOpen={isOpen} onClose={onClose} approval={revoke!} />
    </>
  );
}
