
-- ======================================================================================
-- ===================================  Users  =========================================
-- ======================================================================================


CREATE TABLE Users
(
    UserID INT IDENTITY(1,1) NOT NULL UNIQUE,
    LoginName NVARCHAR(40) NOT NULL,
    PasswordHash NVARCHAR(64) NOT NULL,
    Email NVARCHAR(40) NULL,
	   Access CHAR(1) NOT NULL,
    CONSTRAINT [PK_User_UserID] PRIMARY KEY CLUSTERED (UserID ASC)
)
CREATE TABLE UserAvatar
(
    UserID INT UNIQUE,
    AvatarURL NVARCHAR(64)
)

-- ======================================================================================
-- ===================================  Events  =========================================
-- ======================================================================================

CREATE TABLE Events (
  EventId INT IDENTITY(1,1) PRIMARY KEY,
  EventName VARCHAR(50) NOT NULL, -- Name is required and unique (cannot be NULL)
  EventDesc VARCHAR(800) NOT NULL, -- Description is required (cannot be NULL)
  EventStartTime smalldatetime NOT NULL,
  EventEndTime smalldatetime NOT NULL,
  EntryPrice smallmoney NULL,
  HostId tinyint NOT NULL
  --CONSTRAINT FK_HostId FOREIGN KEY (HostId) REFERENCES Users(UserId)
);

-- ======================================================================================
-- ===================================  Places  =========================================
-- ======================================================================================

INSERT INTO Places (name, description, operatinghours, address)
VALUES
('Old Folks Club', 'It offers events for the elderly to bond together', '9am - 9pm', 'Woodlands Avenue 4'),
('Elderly Support Club', 'It offers support for the elderly','7am - 7pm', 'Yishun Avenue 4');
