package com.sujal.easySettle.controller;
import com.sujal.easySettle.entity.Group;
import com.sujal.easySettle.service.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
