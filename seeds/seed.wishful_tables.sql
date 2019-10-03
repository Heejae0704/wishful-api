BEGIN;

TRUNCATE
    wishful_likes,
    wishful_comments,
    wishful_revelations,
    wishful_predictions,
    wishful_users
    RESTART IDENTITY CASCADE;

INSERT INTO wishful_users (user_name, full_name, email, password)
VALUES
    ('funkytime', 'June Funky', 'ft@gmail.com', '$2a$12$.xGdEInDgEjWsF8shTxhguzxwcXtiyGOjPKg4jkxnUh9yZMiA5tqG'),
    ('mikepunch', 'Mike Tyson', 'mkip@gmail.com', '$2a$12$.yUif6TJsCRH3sZvS9sQ8ubUlRvWhzrg57vI9V5m4agQX1ebS.XK.'),
    ('nofuture', 'James Dean', 'ciga@gmail.com', '$2a$12$JDHJNZbYKxmbS6FC5rtbFubOpg3v/yqM9J5e1izk/U9I0PnGk0D2m'),
    ('rocksolid', 'Jenifer Stone', 'stone@gmail.com', '$2a$12$n7Bi5hZeD8by83Gx.g7.pOvZRLfF.QoFVGSSq4oqfyt0UMBE1tWYS'),
    ('jharris', 'Joshua', 'jharris@thinkful.com', '$2a$12$zgI2rTwNxZ.OT2bAmkh0FeIiK2ym9ymDSbUzu42AuEryYF9G4nlNi');

INSERT INTO wishful_predictions (prediction_who, prediction_what, prediction_when, created_by, prediction_commentary)
VALUES
    ('Amazon', 'launch its Kindle devices in Korea', '2020-10-10', 'funkytime', 'I do not want to buy yet another ebook reader.'),
    ('BTS', 'become famous in the entire universe', '2030-01-01', 'rocksolid', 'Maybe the aliens will also know them by then.'),
    ('Starbucks', 'run out of places to open yet another store in Seoul', '2020-09-01', 'nofuture', 'Too many already.');

INSERT INTO wishful_revelations (revelation_text, is_prediction_correct, evidence, prediction_id, user_id)
VALUES
    ('No they still open new shops like crazy.', false, 'https://www.starbucks.co.kr', 3, 3);

INSERT INTO wishful_comments (content, user_id, prediction_id)
VALUES
    ('There is no way Amazon will do that. Period', 3, 1),
    ('It it happens, I would also be happy', 2, 1),
    ('I am learning BTS dance, and it is very easy.', 1, 2),
    ('It will continue openind shops until all buildings in Seoul have Starbucks on their ground floor.', 4, 3);

INSERT INTO wishful_likes (source_type, source_id, user_id)
VALUES
    ('prediction', 1, 2),
    ('comment', 4, 1),
    ('prediction', 1, 3),
    ('prediction', 1, 4),
    ('comment', 4, 2);

COMMIT;