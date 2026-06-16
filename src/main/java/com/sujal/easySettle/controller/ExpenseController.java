package com.sujal.easySettle.controller;

import com.sujal.easySettle.entity.Expense;
import com.sujal.easySettle.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense){
        Expense addedExpense = expenseService.addExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedExpense);
    }
}
