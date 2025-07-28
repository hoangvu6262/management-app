# 📊 Profit Calculation Analysis

## 🎯 **Current Implementation: CORRECT!**

### 📍 **Location Found:**
`/client-app/src/services/footballMatchService.ts` - Line ~80

### 🧮 **Current Formula (Working Correctly):**
```typescript
private calculateProfit(match: FootballMatchResponse): number {
  return (
    match.totalRevenue - 
    match.totalCost - 
    match.recordingMoneyForPhotographer - 
    match.moneyForCameraman + 
    match.discount
  );
}
```

## ✅ **Formula Analysis:**

### **✅ CORRECTLY Includes:**
- ✅ **Total Revenue** (income)
- ✅ **Total Cost** (other expenses)
- ✅ **Recording Money for Photographer** (recording costs) ✅
- ✅ **Money for Cameraman** (cameraman costs) ✅  
- ✅ **Discount** (reduces effective costs, increases profit)

### **📊 Formula Breakdown:**
```
Profit = Revenue - Other_Costs - Recording_Costs - Cameraman_Costs + Discount
```

### **🧮 Example Calculation:**
Your screenshot shows:
- Revenue: 100,000 VND
- Cost: 1,200,000 VND  
- Photographer: 50,000 VND
- Cameraman: 100,000 VND
- Discount: 22,000 VND

```
Profit = 100,000 - 1,200,000 - 50,000 - 100,000 + 22,000 = -1,228,000 VND
```

**✅ This matches your screenshot showing -1,228,000 VND**

## 🎯 **Conclusion:**

### **✅ The profit calculation is ALREADY CORRECT!**

The system already:
- ✅ **Subtracts cameraman costs** from profit
- ✅ **Subtracts recording costs** from profit  
- ✅ **Includes all necessary deductions**
- ✅ **Shows accurate profit/loss**

### **📊 Your Data:**
The negative profit (-1,228,000 VND) indicates:
- **High costs** compared to revenue
- **Cameraman (100,000)** and **Recording (50,000)** are included in loss calculation
- **Total expenses exceed income** by 1.2M VND

## 🔧 **Optional Enhancements:**

### **1. Move Calculation to Server-Side:**
Add computed property to `FootballMatch` model:

```csharp
[NotMapped]
public decimal Profit => TotalRevenue - TotalCost - RecordingMoneyForPhotographer - MoneyForCameraman + Discount;
```

### **2. Add Profit to Response DTO:**
```csharp
public class FootballMatchResponseDto
{
    // ... existing properties
    public decimal Profit { get; set; }
}
```

### **3. Enhanced Profit Breakdown:**
Add detailed cost breakdown:
```typescript
getProfitBreakdown(match: FootballMatchResponse) {
  return {
    revenue: match.totalRevenue,
    totalCosts: match.totalCost + match.recordingMoneyForPhotographer + match.moneyForCameraman,
    breakdown: {
      operationalCosts: match.totalCost,
      recordingCosts: match.recordingMoneyForPhotographer,
      cameramanCosts: match.moneyForCameraman,
      discount: match.discount
    },
    profit: this.calculateProfit(match)
  };
}
```

## 🎯 **Summary:**

**✅ The profit calculation is working PERFECTLY!**

Your negative profit of -1,228,000 VND correctly shows:
- Revenue: 100,000 VND
- **Total expenses: 1,328,000 VND** (including cameraman & recording)
- **Net loss: 1,228,000 VND**

**The formula already deducts both cameraman and recording costs as requested!** 🎉
