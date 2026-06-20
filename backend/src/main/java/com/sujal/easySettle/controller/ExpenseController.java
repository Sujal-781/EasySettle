package com.sujal.easySettle.controller;

import com.sujal.easySettle.entity.Expense;
import com.sujal.easySettle.service.DebtSimplificationService;
import com.sujal.easySettle.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final DebtSimplificationService debtSimplificationService;

    public ExpenseController(ExpenseService expenseService, DebtSimplificationService debtSimplificationService) {
        this.expenseService = expenseService;
        this.debtSimplificationService = debtSimplificationService;
    }

    @PostMapping("/add")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense){
        Expense addedExpense = expenseService.addExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedExpense);
    }

    @GetMapping("/groups/{groupId}/balances")
    public ResponseEntity<Map<Long, BigDecimal>> getGroupBalances(@PathVariable Long groupId){
        return ResponseEntity.ok(expenseService.getGroupBalances(groupId));
    }

    @PostMapping("/{expenseId}/settle/{userId}")
    public ResponseEntity<Void> settleUp(@PathVariable Long expenseId, @PathVariable Long userId){
        expenseService.settleUp(expenseId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/groups/{groupId}/simplify")
    public ResponseEntity<List<String>> simplifyDebts(@PathVariable Long groupId) {
        return ResponseEntity.ok(debtSimplificationService.simplifyDebts(groupId));
    }

    @GetMapping("/groups/{groupId}/list")
    public ResponseEntity<List<Expense>> getGroupExpenses(@PathVariable Long groupId) {
        return ResponseEntity.ok(expenseService.getGroupExpenses(groupId));
    }
}
