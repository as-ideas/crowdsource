package de.asideas.crowdsource.testutil;

import de.asideas.crowdsource.domain.model.UserEntity;

public class Fixtures {

    public static UserEntity givenUserEntity(String userId) {
        final UserEntity initiator = new UserEntity("test_mail", "test_firstname", "test_lastname");
        initiator.setId(userId);
        return initiator;
    }
}
