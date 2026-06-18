package com.sujal.easySettle.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DebtSimplificationService {

    private final ExpenseService expenseService;

    public DebtSimplificationService(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    public List<String> simplifyDebts(Long groupId) {
        Map<Long, BigDecimal> balances = expenseService.getGroupBalances(groupId);

        // separate into creditors and debtors
        // use TreeMap so we can modify while iterating safely
        Map<Long, BigDecimal> creditors = new HashMap<>();
        Map<Long, BigDecimal> debtors = new HashMap<>();

        for (Long id : balances.keySet()) {
            BigDecimal balance = balances.get(id);
            if (balance.compareTo(BigDecimal.ZERO) > 0) creditors.put(id, balance);
            if (balance.compareTo(BigDecimal.ZERO) < 0) debtors.put(id, balance.abs()); // store as positive
        }

        List<String> transactions = new ArrayList<>();

        // greedy matching
        while (!creditors.isEmpty() && !debtors.isEmpty()) {

            // pick largest creditor and largest debtor
            Long creditorId = Collections.max(creditors.entrySet(),
                    Map.Entry.comparingByValue()).getKey();
            Long debtorId = Collections.max(debtors.entrySet(),
                    Map.Entry.comparingByValue()).getKey();

            BigDecimal creditAmount = creditors.get(creditorId);
            BigDecimal debtAmount = debtors.get(debtorId);

            // the transaction amount is the smaller of the two
            BigDecimal transactionAmount = creditAmount.min(debtAmount);

            // record the transaction
            transactions.add("User " + debtorId + " pays User " + creditorId
                    + " ₹" + transactionAmount);

            // reduce both balances
            creditors.put(creditorId, creditAmount.subtract(transactionAmount));
            debtors.put(debtorId, debtAmount.subtract(transactionAmount));

            // remove if fully settled
            if (creditors.get(creditorId).compareTo(BigDecimal.ZERO) == 0)
                creditors.remove(creditorId);
            if (debtors.get(debtorId).compareTo(BigDecimal.ZERO) == 0)
                debtors.remove(debtorId);
        }

        return transactions;
    }
}
