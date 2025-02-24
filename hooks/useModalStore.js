import { create } from "zustand";

// export type ModalType =
//   | "mediwiseLogin"
//   | "addWorkSchedule"
//   | "createBarangayItem"
//   | "createDoctor"
//   | "addAppointment"
//   | "addPrescription"
//   | "viewPrescription"
//   | "createSupplier"
//   | "createBarangay"
//   | "createAdmin"
//   | "createPatient"
//   | "createSmsItem"
//   | "createEvent"
//   | "inventoryReport"
//   | "createRequest"
//   | "viewRequest"
//   | "manageAppointment"
//   | "deleteAppointment"
//   | "deletePrescription"
//   | "updateBarangayItem"
//   | "deleteBarangayItem"
//   | "deleteSmsItem"
//   | "updateSmsItem"
//   | "deleteEvent"
//   | "deleteAnnouncement"
//   | "rescheduleAppointment"
//   | "addNewItemStock"
//   | "addNewItemStockSms"
//   | "viewPhoto"
//   | "registerTermsAndCondition"
//   | "appointmentSide"
//   | "addDoctorSchedule"
//   | "updatePrescription"
//   | "confirmRequest"
// you can extend this type if you have more modal

// export type ModalType = "..." | "...." | "...."

// type ModalData = {
//   calendarApi
//   user;
//   prescription;
//   brgyItems;
//   brgyItem;
//   smsItem;
//   photoUrl;
//   transactionRequest;
//   appointment;
// };

// type ModalStore = {
//   type: ModalType | null;
//   data: ModalData;
//   isOpen: boolean;
//   onOpen: (type: ModalType, data?: ModalData) => void;
//   onClose: () => void;
// };

export const useModal = create((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onClose: () => set({ data: {}, type: null, isOpen: false }),
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
}));