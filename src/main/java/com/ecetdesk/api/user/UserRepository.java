package com.ecetdesk.api.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    UserAccount save(UserAccount user);
    Optional<UserAccount> findById(UUID id);
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    List<UserAccount> findAll();
    boolean existsByRole(UserRole role);
    boolean existsByEmailIgnoreCase(String email);
}
