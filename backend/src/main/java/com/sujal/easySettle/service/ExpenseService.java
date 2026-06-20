package com.sujal.easySettle.service;

import com.sujal.easySettle.entity.Expense;
import com.sujal.easySettle.entity.ExpenseSplit;
import com.sujal.easySettle.entity.Group;
import com.sujal.easySettle.entity.User;
import com.sujal.easySettle.repository.ExpenseRepository;
import com.sujal.easySettle.repository.ExpenseSplitRepository;
import com.sujal.easySettle.repository.GroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public Map<Long, BigDecimal> getGroupBalances(Long groupId) {
        // step 1: get all expenses in the group
        List<Expense> expenses = expenseRepository.findByGroupId(groupId);

        // step 2: map to track each user's net balance
        Map<Long, BigDecimal> balances = new HashMap<>();

        // step 3: loop through each expense
        for (Expense expense : expenses) {
            List<ExpenseSplit> splits = expenseSplitRepository.findByExpenseId(expense.getId());

            for (ExpenseSplit split : splits) {
                if (split.isSettled()) continue; // skip settled splits

                Long paidByUserId = expense.getPaidBy().getId();
                Long owedByUserId = split.getUser().getId();
                BigDecimal amount = split.getAmountOwed();

                // credit the person who paid
                balances.merge(paidByUserId, amount, BigDecimal::add);

                // debit the person who owes
                balances.merge(owedByUserId, amount.negate(), BigDecimal::add);
            }
        }

        return balances;
    }

    @Transactional
    public void settleUp(Long expenseId, Long userId){
        ExpenseSplit split = expenseSplitRepository.findByExpenseIdAndUserId(expenseId, userId)
                        .orElseThrow(() -> new RuntimeException("Split not found for expenseId: "
                                + expenseId + " and userId: " + userId));

        split.setSettled(true);

        expenseSplitRepository.save(split);

    }


    public List<Expense> getGroupExpenses(Long groupId) {
        return expenseRepository.findByGroupId(groupId);
    }
}
