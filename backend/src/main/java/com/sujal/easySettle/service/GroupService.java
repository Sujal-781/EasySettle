package com.sujal.easySettle.service;

import com.sujal.easySettle.entity.Group;
import com.sujal.easySettle.entity.User;
import com.sujal.easySettle.repository.GroupRepository;
import com.sujal.easySettle.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    GroupService(GroupRepository groupRepository, UserRepository userRepository){
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public Group createGroup(Group group){
        return groupRepository.save(group);
    }

    @Transactional
    public void addMember(Long groupId, Long userId){
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        group.getMembers().add(user);
        groupRepository.save(group);
    }

    public Group getGroupById(Long id){
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
    }

    public List<Group> getGroupsByUserId(Long userId) {
        return groupRepository.findByMembersId(userId);
    }
}
