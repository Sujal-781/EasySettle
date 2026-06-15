package com.sujal.easySettle.service;

import com.sujal.easySettle.entity.Expense;
import com.sujal.easySettle.entity.ExpenseSplit;
import com.sujal.easySettle.entity.Group;
import com.sujal.easySettle.entity.User;
import com.sujal.easySettle.repository.ExpenseRepository;
import com.sujal.easySettle.repository.ExpenseSplitRepository;
import com.sujal.easySettle.repository.GroupRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;

    public ExpenseService(ExpenseRepository expenseRepository, ExpenseSplitRepository expenseSplitRepository, GroupRepository groupRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseSplitRepository = expenseSplitRepository;
        this.groupRepository = groupRepository;
    }

    @Transactional
    public Expense addExpense(Expense expense) {

        // step 1: save the expense
        Expense savedExpense = expenseRepository.save(expense);

        // step 2: get the group and its members
        Group group = groupRepository.findById(expense.getGroup().getId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<User> members = group.getMembers();

        if (members.isEmpty()) {
            throw new RuntimeException("Group has no members");
        }

        // step 3: divide amount equally — BigDecimal division
        BigDecimal splitAmount = expense.getAmount()
                .divide(BigDecimal.valueOf(members.size()), 2, RoundingMode.HALF_UP);

        // step 4: create one ExpenseSplit per member
        for (User member : members) {
            ExpenseSplit split = ExpenseSplit.builder()
                    .expense(savedExpense)
                    .user(member)
                    .amountOwed(splitAmount)
                    .isSettled(false)
                    .build();
            expenseSplitRepository.save(split);
        }

        return savedExpense;
    }
}
