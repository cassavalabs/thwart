import { Link } from '@chakra-ui/next-js';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  HStack,
  Icon,
  IconButton,
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
import {
  FaRegFileAlt,
  FaUnlink,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { ApiResponse, Approval } from '@app/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { Tooltip } from '../Tooltip';
import { useWeb3React } from '@web3-react/core';
import { formateDate } from '@app/utils';
import { useExplorer } from '@app/hooks';
import RevokeModal from '@app/components/RevokeModal';

export default function ERC20Table() {
  const searchParams = useSearchParams();
  const type = Number(searchParams.get('type'));
  const search = String(searchParams.get('search'));
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  const [approvals, setApprovals] = useState<ApiResponse | null>(null);
  const [revoke, setRevoke] = useState<Approval | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useWeb3React();
  const { getExplorerUrl } = useExplorer();

  useEffect(() => {
    const request = async () => {
      if (type && isAddress(search)) {
        setIsLoading(true);
        const withPage = page ? `&page=${page}` : '';
        const withPageSize = limit ? `&limit=${limit}` : '';
        const res = await fetch(
          `/api?type=${type}&search=${search}${withPage}${withPageSize}`
        );
        const result = await res.json();

        if (result.data) {
          setApprovals(result.data);
        }
        setIsLoading(false);
      }
    };

    request();
  }, [search, type, limit, page]);

  const noRecords = approvals && approvals.docs.length === 0 && !isLoading;

  const handlePageNav = (page?: number | null) => {
    if (!page) return;
    urlSearchParams.set('page', page.toString());
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const handlePageSize = (limit: string) => {
    urlSearchParams.set('limit', limit);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <>
      <CardBody>
        <Text mb="1rem">
          A total of {approvals?.totalDocs ?? 0} Token approvals found
        </Text>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Assets</Th>
                <Th>Approved Spender</Th>
                <Th>Allowance</Th>
                <Th>Updated At</Th>
                <Th>Transaction Hash</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {approvals?.docs.map(({ contract, operator, ...approval }) => {
                const name = contract?.name || approval.contractAddress;
                const symbol = contract?.symbol || '';
                const spender = operator?.name || approval.spender;
                const date = approval.dateApproved
                  ? formateDate(approval.dateApproved)
                  : null;
                const value = BigInt(approval?.value || 0);
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
                        <HStack maxW="10rem">
                          <Avatar
                            size="xs"
                            src="/9001.png"
                            filter="grayscale(100%)"
                            ignoreFallback
                          />
                          <Tooltip label={name}>
                            <Text variant="textLink">{name}</Text>
                          </Tooltip>
                        </HStack>
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
                      <HStack spacing={1}>
                        <Text>{allowance}</Text>
                        <Link
                          href={getExplorerUrl(
                            'account',
                            approval.contractAddress
                          )}
                          target="_blank"
                          textDecoration="none !important"
                        >
                          <Text variant="textLink" textTransform="uppercase">
                            {symbol}
                          </Text>
                        </Link>
                      </HStack>
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
                        No Token Approvals found for address
                      </Text>
                    </Box>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
      <CardFooter
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          <Text color="gray.400" whiteSpace="nowrap">
            Show rows:{' '}
          </Text>
          <Select
            size="sm"
            defaultValue={20}
            onChange={(e) => handlePageSize(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </Select>
        </HStack>
        <ButtonGroup>
          <IconButton
            icon={<FaAngleDoubleLeft />}
            aria-label="prev button"
            isDisabled={!approvals?.hasPrevPage}
            onClick={() => handlePageNav(approvals?.prevPage)}
          />
          <IconButton
            icon={<FaAngleDoubleRight />}
            aria-label="prev button"
            isDisabled={!approvals?.hasNextPage}
            onClick={() => handlePageNav(approvals?.nextPage)}
          />
        </ButtonGroup>
      </CardFooter>
      <RevokeModal isOpen={isOpen} onClose={onClose} approval={revoke!} />
    </>
  );
}
