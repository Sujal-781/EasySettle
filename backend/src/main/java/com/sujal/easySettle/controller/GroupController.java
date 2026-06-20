package com.sujal.easySettle.controller;
import com.sujal.easySettle.entity.Group;
import com.sujal.easySettle.entity.User;
import com.sujal.easySettle.service.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Group> create(@RequestBody Group group){
        Group savedGroup = groupService.createGroup(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup);
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> addMember(@PathVariable Long groupId, @PathVariable Long userId){
        groupService.addMember(groupId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id){
        Group group = groupService.getGroupById(id);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getGroupsByUser(@PathVariable Long userId){
        return ResponseEntity.ok(groupService.getGroupsByUserId(userId));
    }
}
