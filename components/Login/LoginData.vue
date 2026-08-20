<script lang="ts" setup>
import LoginParams from '~/features/LoginFeature/Core/Params/login_params';
import LoginController from '~/features/LoginFeature/presentation/controllers/login_controller';
import countries from "~/data/countries.json";
import FetchPaymentMethodsParams from '~/features/fetch_payment_methods/Core/Params/fetch_payment_methods_params';
import FetchPaymentMethodController from '~/features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller';
import { rememberAuthRedirect, sanitizeAuthRedirect } from '~/utils/authRedirect';
import GuestAccessLink from '~/components/AuthLayout/GuestAccessLink.vue';

const router = useRouter();
const route = useRoute();
definePageMeta({
    layout: 'login'
});
const UserSettingStore = useSettingStore();
const Credential = ref('');
const LoginPassword = ref('');
const showLoginPassword = ref(false);
const selectedCountry = ref(UserSettingStore?.setting?.country_code);
const redirectPath = computed(() => sanitizeAuthRedirect(route.query.redirect));
const registerTarget = computed(() => ({
    path: '/Auth/register',
    ...(redirectPath.value ? { query: { redirect: redirectPath.value } } : {}),
}));

onMounted(() => {
    rememberAuthRedirect(route.query.redirect);
});



const PaymentStore = usePaymentStore();
const FetchPaymentMethod = async () => {
    const paymentMethod = new FetchPaymentMethodsParams(1);
    const fetchPaymentMethodController =
        FetchPaymentMethodController.getInstance();
    const state = await fetchPaymentMethodController.FetchPaymentMthod(
        paymentMethod
    );
    if (state.value.data) {
        PaymentStore.setPayment(state.value.data);
    }
};

const LoginData = async () => {
    rememberAuthRedirect(route.query.redirect);
    window.localStorage.clear();
    const loginParams = new LoginParams(Credential.value, LoginPassword.value);
    const loginController = LoginController.getInstance();
    await loginController.login(loginParams, router);
    await FetchPaymentMethod();

}

// Handle Enter key press
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        LoginData();
    }
}



</script>

<template>
    <div class="login-home-redesign" dir="rtl">
        <section class="login-home-form-panel">
            <div class="login-home-form-wrap">
                <span class="login-home-kicker">{{ $t('دخول الطالب') }}</span>
                <h1>{{ $t('تسجيل الدخول') }}</h1>
                <p class="login-home-lead">
                    {{ $t('اكتب رقم الموبايل وكلمة المرور، ثم انتقل إلى مساحة الطالب.') }}
                </p>

                <!-- <div class="login-home-notice">
                    <span class="login-home-notice-icon" aria-hidden="true">i</span>
                    <div>
                        <strong>{{ $t('دخول منفصل وآمن ليك إنت') }}</strong>
                        <small>{{ $t('لا ترسل أي بيانات أو تشارك كلمة مرورك مع أي شخص.') }}</small>
                    </div>
                </div> -->

                <!-- <div class="login-home-preview">
                    <div>
                        <strong>{{ $t('افتح معاينة مساحة الطالب') }}</strong>
                        <small>{{ $t('المعاينة الحالية تعرض تنظيم محتوى الطالب بشكل واضح.') }}</small>
                    </div>
                    <span aria-hidden="true">←</span>
                </div> -->

                <div class="login-home-divider">
                    <span>{{ $t('أو سجّل دخولك إلى حسابك') }}</span>
                </div>

                <div class="login-home-fields">
                    <label class="login-home-label" for="login-phone">{{ $t('رقم الموبايل') }}</label>
                    <div class="login-home-phone">
                        <div class="login-home-input">
                            <input
                                id="login-phone"
                                v-model="Credential"
                                type="text"
                                inputmode="tel"
                                autocomplete="tel"
                                @keydown="handleKeyPress"
                            >
                        </div>

                        <div
                            v-if="UserSettingStore?.setting?.country_code_required"
                            class="login-home-country"
                        >
                            <Select
                                :defaultValue="{ dial_code: `${UserSettingStore?.setting?.country_code}` }"
                                v-model="selectedCountry"
                                :options="countries"
                                filter
                                optionLabel="name"
                                class="login-home-country-select"
                            >
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="login-home-country-value">
                                        <span>{{ slotProps.value.dial_code }}</span>
                                        <span>{{ slotProps.value.flag }}</span>
                                    </div>
                                </template>

                                <template #option="slotProps">
                                    <div class="login-home-country-option">
                                        <span>{{ slotProps.option.flag }}</span>
                                        <span>{{ slotProps.option.name }}</span>
                                        <span>({{ slotProps.option.dial_code }})</span>
                                    </div>
                                </template>
                            </Select>
                        </div>
                    </div>

                    <label class="login-home-label" for="login-password">{{ $t('كلمة المرور') }}</label>
                    <div class="login-home-input login-home-password">
                        <input
                            id="login-password"
                            v-model="LoginPassword"
                            :type="showLoginPassword ? 'text' : 'password'"
                            autocomplete="current-password"
                            @keydown="handleKeyPress"
                        >
                        <button
                            type="button"
                            class="login-home-password-toggle"
                            :aria-label="showLoginPassword ? $t('إخفاء كلمة المرور') : $t('إظهار كلمة المرور')"
                            :aria-pressed="showLoginPassword"
                            @click="showLoginPassword = !showLoginPassword"
                        >
                            <svg v-if="showLoginPassword" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5.3 0 8.6 4.8 9 5.5a1 1 0 0 1 0 1c-.5.8-1.6 2.3-3.2 3.5M6.2 6.2C4.5 7.3 3.4 8.8 3 9.5a1 1 0 0 0 0 1C3.4 11.3 6.7 16 12 16c.7 0 1.4-.1 2-.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M3 11.5C3.5 10.7 6.7 6 12 6s8.5 4.7 9 5.5c.1.3.1.7 0 1-.5.8-3.7 5.5-9 5.5s-8.5-4.7-9-5.5a1 1 0 0 1 0-1Z" stroke="currentColor" stroke-width="1.8" />
                                <circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8" />
                            </svg>
                        </button>
                    </div>

                    <div class="login-home-options">
                        <div class="login-home-remember">
                            <input id="remember" type="checkbox">
                            <label for="remember">{{ $t('تذكرني') }}</label>
                        </div>
                        <nuxt-link to="/login/resetpassword">
                            {{ $t('هل نسيت كلمة المرور؟') }}
                        </nuxt-link>
                    </div>

                    <button class="login-home-submit" type="button" @click="LoginData">
                        <span>{{ $t('دخول مساحة الطالب') }}</span>
                        <span aria-hidden="true">←</span>
                    </button>

                    <GuestAccessLink />
                </div>

                <div class="login-home-benefits-title">
                    <span>{{ $t('داخل مساحة الطالب') }}</span>
                </div>

                <ul class="login-home-benefits">
                    <li>
                        <span aria-hidden="true">✓</span>
                        <div>
                            <strong>{{ $t('محتوى صفك') }}</strong>
                            <small>{{ $t('كل صف يظهر محتواه بشكل مستقل') }}</small>
                        </div>
                    </li>
                    <li>
                        <span aria-hidden="true">✓</span>
                        <div>
                            <strong>{{ $t('تفاصيل واضحة') }}</strong>
                            <small>{{ $t('أعداد الفيديوهات والملفات داخل كل كورس') }}</small>
                        </div>
                    </li>
                    <li>
                        <span aria-hidden="true">✓</span>
                        <div>
                            <strong>{{ $t('وصول سريع') }}</strong>
                            <small>{{ $t('انتقل إلى مساحة الطالب بخطوة واحدة') }}</small>
                        </div>
                    </li>
                </ul>

                <div class="login-home-register">
                    <span class="login-home-register__copy">
                        <strong>{{ $t('ليس لديك حساب حتى الآن؟') }}</strong>
                        <small>{{ $t('أنشئ حسابك وابدأ الوصول إلى محتوى صفك.') }}</small>
                    </span>
                    <nuxt-link :to="registerTarget">
                        <span>{{ $t('إنشاء حساب') }}</span>
                        <span aria-hidden="true">←</span>
                    </nuxt-link>
                </div>
            </div>
        </section>

        <aside class="login-home-visual" aria-label="مميزات مساحة الطالب">
            <NuxtLink to="/" class="login-home-brand" aria-label="العودة إلى الصفحة الرئيسية">
                <img :src="UserSettingStore.setting?.image?.img" :alt="UserSettingStore.setting?.name || 'logo'">
                <div>
                    <strong>{{ UserSettingStore.setting?.name }}</strong>
                    <small>{{ UserSettingStore.setting?.description }}</small>
                </div>
            </NuxtLink>

            <div class="login-home-visual-copy">
                <span>{{ $t('مساحة الطالب') }}</span>
                <h2>
                    {{ $t('راجع دروسك،') }}
                    <strong>{{ $t('واختبر فهمك.') }}</strong>
                </h2>
                <p>{{ $t('مكان واحد لكورساتك ومتابعتها، منظمة حسب الصف الدراسي من غير خلط.') }}</p>

                <div class="login-home-stage-count">
                    <strong>{{ $t('3 صفوف') }}</strong>
                    <span>{{ $t('أولى · ثانية') }}<br>{{ $t('ثالثة ثانوي') }}</span>
                </div>
            </div>

            <span class="login-home-ring login-home-ring-one" aria-hidden="true" />
            <span class="login-home-ring login-home-ring-two" aria-hidden="true" />
        </aside>
    </div>
</template>

<style scoped src="~/assets/style/login-home-redesign/login-home.css"></style>
