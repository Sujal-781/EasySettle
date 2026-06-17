package com.sujal.easySettle.controller;

import com.sujal.easySettle.entity.Expense;
import com.sujal.easySettle.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
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
}
