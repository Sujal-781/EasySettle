package com.sujal.easySettle.repository;

import com.sujal.easySettle.entity.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit,Long> {
    List<ExpenseSplit> findByExpenseId(Long expenseId);
    List<ExpenseSplit> findByUserIdAndIsSettledFalse(Long userId); // all unsettled splits for a user
    Optional<ExpenseSplit> findByExpenseIdAndUserId(Long expenseId, Long userId);
}
