CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dateCreated TIMESTAMP,
    premium VARCHAR(255)
);

CREATE TABLE pollDataC (
    id SERIAL PRIMARY KEY,
    pollType VARCHAR(25),
    question VARCHAR(255) NOT NULL,
    options TEXT[],
    codeLink TEXT UNIQUE,
    dateCreated TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE pollDataP (
    id SERIAL PRIMARY KEY,
    poll_id int,
    choice VARCHAR(255),
    codeLink TEXT,
    dateViewed TIMESTAMP,
    dateVoted TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY(poll_id) REFERENCES pollDataC(id),
    UNIQUE(user_id,poll_id)
);