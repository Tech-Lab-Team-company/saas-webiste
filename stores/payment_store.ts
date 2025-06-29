import { defineStore } from "pinia";
import type PaymentMethodModel from "~/features/fetch_payment_methods/Data/models/fetch_payment_method_model";

export const usePaymentStore = defineStore("payment", () => {
   const Payment = ref<PaymentMethodModel[]>();

    function setPayment(data: PaymentMethodModel[]) {
        Payment.value = data;
    }
    return {
        Payment,
        setPayment,
    };
}, { persist: true });