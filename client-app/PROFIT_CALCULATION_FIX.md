# 🔧 Profit Calculation Fix - Discount Should Be Subtracted

## ❌ **Previous Formula (INCORRECT):**
```typescript
profit = totalRevenue - totalCost - recordingMoney - cameramanMoney + discount
```

## ✅ **Corrected Formula (FIXED):**
```typescript
profit = totalRevenue - totalCost - recordingMoney - cameramanMoney - discount
```

## 🎯 **Key Change:**
**Changed:** `+ discount` → `- discount`

## 💡 **Logic Explanation:**

### **Discount represents money given away/reduced from revenue:**
- Discount = Money that reduces the effective revenue
- Should be **subtracted** from profit, not added
- Example: If you give 10,000 VND discount, you earn 10,000 VND less

### **Business Logic:**
```
Revenue: 100,000 VND (what customer should pay)
Discount: 22,000 VND (what you reduce for customer)
Effective Revenue: 78,000 VND (what you actually receive)
```

## 🧮 **Calculation Examples:**

### **Previous (Wrong) Calculation:**
```
Revenue: 100,000 VND
Cost: 1,200,000 VND
Photographer: 50,000 VND
Cameraman: 100,000 VND
Discount: 22,000 VND

Profit = 100,000 - 1,200,000 - 50,000 - 100,000 + 22,000 = -1,228,000 VND
```

### **New (Correct) Calculation:**
```
Revenue: 100,000 VND
Cost: 1,200,000 VND
Photographer: 50,000 VND
Cameraman: 100,000 VND
Discount: 22,000 VND

Profit = 100,000 - 1,200,000 - 50,000 - 100,000 - 22,000 = -1,272,000 VND
```

## 📊 **Impact on Your Data:**
- **Before Fix:** Profit = -1,228,000 VND
- **After Fix:** Profit = -1,272,000 VND  
- **Difference:** -44,000 VND (more loss due to discount being properly subtracted)

## ✅ **Corrected Formula Components:**

### **Revenue (Income):**
- ✅ Total Revenue (what customer pays before discount)

### **Costs (Outgoing):**
- ✅ Total Cost (operational costs)
- ✅ Recording Money for Photographer
- ✅ Money for Cameraman  
- ✅ **Discount** (money given away to customer)

## 🎯 **Final Formula:**
```
Profit = Revenue - All_Costs - All_Payments - Discounts_Given

Where:
- Revenue = Money received from customer
- All_Costs = Operational expenses
- All_Payments = Photographer + Cameraman payments
- Discounts_Given = Money reduced from customer payment
```

## 🔧 **Implementation:**
The fix has been applied in:
`/client-app/src/services/footballMatchService.ts`

**Line ~89:** Changed `+ match.discount` to `- match.discount`

## ✅ **Verification:**
After refresh, profit calculations will show:
- **More accurate loss/profit** amounts
- **Discount properly subtracted** from profit
- **Consistent business logic** across all matches

**Fix applied! Discount now correctly reduces profit instead of increasing it! 🎯**
