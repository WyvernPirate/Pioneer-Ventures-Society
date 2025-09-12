# Payment Setup Guide for Botswana

## Flutterwave Setup (Recommended for Botswana)

### Why Flutterwave?
- ✅ Supports Botswana (BWP currency)
- ✅ Handles local mobile money (Orange Money, Mascom MyZaka, BTC Smega)
- ✅ International card payments (Visa, Mastercard)
- ✅ Good API documentation
- ✅ Reasonable fees for African markets

### Setup Steps:

1. **Create Flutterwave Account**
   - Go to https://flutterwave.com
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys**
   - Login to your Flutterwave dashboard
   - Go to Settings > API Keys
   - Copy your Public Key (starts with FLWPUBK_)
   - Copy your Secret Key (starts with FLWSECK_)

3. **Configure Environment Variables**
   ```bash
   # In your .env file
   VITE_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-your-public-key"
   VITE_FLUTTERWAVE_SANDBOX="true"  # Set to "false" for production
   ```

4. **Test Payments**
   - Use sandbox mode first
   - Test with Flutterwave test cards
   - Test mobile money flows

5. **Go Live**
   - Complete business verification
   - Switch to live keys
   - Set VITE_FLUTTERWAVE_SANDBOX="false"

### Supported Payment Methods in Botswana:
- **Cards**: Visa, Mastercard, Verve
- **Mobile Money**: Orange Money, Mascom MyZaka, BTC Smega
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking codes

### Alternative Options:

#### 1. DPO Pay (PayGate)
- Good for Botswana
- Supports local banks
- More complex setup

#### 2. Stripe (with local bank)
- International solution
- May need local banking partner
- Excellent developer experience

#### 3. Manual Payment Processing
- Mobile money instructions
- Bank transfer details
- Manual confirmation process

### Mobile Money Setup (Manual)

If you prefer manual mobile money processing:

1. **Orange Money**: *144*1*1*[amount]*77421107#
2. **Mascom MyZaka**: *151*2*1*[amount]*77421107#
3. **BTC Smega**: *150*2*1*[amount]*77421107#
4. **FNB Pay2Cell**: *120*321# then enter 77421107

### Bank Transfer Details

```
Bank: First National Bank Botswana
Account Name: Pioneer Ventures Society
Account Number: 62123456789
Branch Code: 282267
SWIFT: FIRNBWGX
```

### Security Considerations

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** for all payment pages
3. **Validate payments** on your backend
4. **Store payment records** securely
5. **Implement webhook verification**

### Testing

Use these test details for Flutterwave:
- **Test Card**: 4187427415564246
- **CVV**: 828
- **Expiry**: 09/32
- **PIN**: 3310
- **OTP**: 12345

### Support

- **Flutterwave Support**: support@flutterwave.com
- **Documentation**: https://developer.flutterwave.com
- **Botswana Contact**: Check Flutterwave website for local support