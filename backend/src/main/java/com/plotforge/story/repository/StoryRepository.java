package com.plotforge.story.repository;

import com.plotforge.story.entity.Story;
import com.plotforge.story.entity.StoryStatus;
import com.plotforge.user.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoryRepository extends JpaRepository<Story, Long> {

    List<Story> findByUser(user user);

    Optional<Story> findByIdAndUser(Long id, user user);

    long countByUser(user user);

    long countByUserAndStatus(user user, StoryStatus status);
}