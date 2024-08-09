
-- ======================================================================================
-- ===================================  Users  ==========================================
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
CREATE TABLE UserProfiles
(
    ProfilePic NVARCHAR(512) NULL,
    UserID INT NOT NULL PRIMARY KEY, -- must keep this
    UserDesc NVARCHAR(800) NULL,
    CONSTRAINT FK_UserProfile_UserID FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ======================================================================================
-- ===================================  Otps  ===========================================
-- ======================================================================================
CREATE TABLE Otps
(
    UserID INT NOT NULL PRIMARY KEY, -- must keep this
    Email NVARCHAR(40) NULL,
    Otp NVARCHAR(6) NOT NULL,
    CONSTRAINT FK_OTP_UserID FOREIGN KEY (UserID) REFERENCES Users(UserID)
);




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

CREATE TABLE Places (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(1500) NOT NULL UNIQUE, 
  operatinghours VARCHAR(100) NOT NULL,
  address VARCHAR(1000) NOT NULL UNIQUE
);


INSERT INTO Places (name, description, operatinghours, address)
VALUES
('Old Folks Club', 'It offers events for the elderly to bond together', '9am - 9pm', 'Woodlands Avenue 4'),
('Elderly Support Club', 'It offers support for the elderly','7am - 7pm', 'Yishun Avenue 4');
