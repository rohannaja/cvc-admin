import RejectReasonModal from "@/components/modals/reject-reason-modal";
import StatementModal from "@/components/modals/statement-modal";
import TransactionModal from "@/components/modals/transaction-modal";
import WalletModal from "@/components/modals/wallet-modal";

const ModalProvider = () => {
	return (
		<>
			<TransactionModal />
			<RejectReasonModal />
			<StatementModal />
			<WalletModal />
		</>
	);
};

export default ModalProvider;