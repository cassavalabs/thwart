import {
  Authorization__factory,
  FTMinimal__factory,
  NFTMinimal__factory,
} from "@app/abis/types";
import { useExplorer } from "@app/hooks";
import { Approval, ApprovalKind } from "@app/types";
import { shortenAddress } from "@app/utils";
import {
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { FaUnlink, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

interface RevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: Approval;
}

enum View {
  CONFIRM,
  PENDING,
  SUCCESS,
}

export default function RevokeModal(props: RevokeModalProps) {
  const { isOpen, onClose, approval } = props;
  const [view, setView] = useState<View>(View.CONFIRM);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { account, provider } = useWeb3React();
  const { getExplorerUrl } = useExplorer();

  const revoke = async () => {
    if (!account || !provider) {
      return;
    }

    const signer = provider.getSigner(account);

    switch (approval.approvalKind) {
      case ApprovalKind.AUTHORIZATION: {
        try {
          const contract = Authorization__factory.connect(
            approval.contractAddress,
            signer
          );

          setView(View.PENDING);

          const tx = await contract.approve(
            approval.spender,
            BigInt(0),
            approval.methods!
          );

          const receipt = await tx.wait();
          setTxHash(receipt.transactionHash);
          setView(View.SUCCESS);
          toast("Authorization revoked successfully", {
            theme: "colored",
            type: "success",
          });
        } catch (error: any) {
          if (error.code === "ACTION_REJECTED") {
            toast("You rejected the transaction", {
              theme: "colored",
              type: "error",
            });
            setView(View.CONFIRM);
          }
        }
        break;
      }

      case ApprovalKind.ERC20: {
        try {
          const contract = FTMinimal__factory.connect(
            approval.contractAddress,
            signer
          );

          setView(View.PENDING);

          const tx = await contract.approve(approval.spender, BigInt(0));

          const receipt = await tx.wait();
          setTxHash(receipt.transactionHash);
          setView(View.SUCCESS);
          toast("Token approval revoked successfully", {
            theme: "colored",
            type: "success",
          });
        } catch (error: any) {
          if (error.code === "ACTION_REJECTED") {
            toast("You rejected the transaction", {
              theme: "colored",
              type: "error",
            });
            setView(View.CONFIRM);
          }
        }
        break;
      }

      case ApprovalKind.GENERIC_AUTH: {
        break;
      }

      case ApprovalKind.NFT: {
        try {
          const contract = NFTMinimal__factory.connect(
            approval.contractAddress,
            signer
          );

          setView(View.PENDING);

          const tx = await contract.setApprovalForAll(approval.spender, false);
          const receipt = await tx.wait();
          setTxHash(receipt.transactionHash);
          setView(View.SUCCESS);
          toast("Token approval revoked successfully", {
            theme: "colored",
            type: "success",
          });
        } catch (error: any) {
          if (error.code === "ACTION_REJECTED") {
            toast("You rejected the transaction", {
              theme: "colored",
              type: "error",
            });
            setView(View.CONFIRM);
          }
        }
        break;
      }
    }
  };

  const Confirm = () => {
    return (
      <VStack spacing={5}>
        <Icon boxSize="4rem" as={FaUnlink} />
        <Text fontSize="1.5rem" fontWeight={600} textAlign="center">
          Confirm Revoke Action
        </Text>
        <Text textAlign="center">
          Are you sure you want to revoke the approval you previously granted to{" "}
          {shortenAddress(approval.spender)}.
        </Text>
        <HStack>
          <Button variant="primary" onClick={revoke} h="3rem" fontSize="1rem">
            Revoke
          </Button>
          <Button h="3rem" onClick={onClose}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    );
  };

  const Pending = () => {
    return (
      <VStack spacing={5}>
        <Spinner color="blue.500" boxSize="100px" speed="0.5s" />
        <Text textAlign="center">
          Please approve this transaction on your wallet to complete revoke
          approval
        </Text>
        <Button h="3rem" onClick={onClose}>
          Cancel
        </Button>
      </VStack>
    );
  };

  const Success = () => {
    return (
      <VStack spacing={5}>
        <HStack w="full" justifyContent="center">
          <Icon boxSize="100px" color="green.300" as={FaCheckCircle} />
        </HStack>
        <Text textAlign="center">
          Well done! You have successfully revoked an approval, the UI might
          take some minutes to reflect this changes.
        </Text>
        <HStack>
          <Button
            colorScheme="green"
            as="a"
            href={getExplorerUrl("tx", txHash!)}
          >
            View Tx
          </Button>
          <Button onClick={onClose}>Close</Button>
        </HStack>
      </VStack>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="1.5rem">
          {view === View.PENDING ? (
            <Pending />
          ) : view === View.SUCCESS ? (
            <Success />
          ) : (
            <Confirm />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
