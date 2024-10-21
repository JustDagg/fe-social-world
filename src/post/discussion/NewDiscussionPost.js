import React, { useState } from 'react';
import { createDiscussionPost } from '../apiPost';
import { isAuthenticated } from '../../auth/index';
import { withRouter } from 'react-router-dom';

const NewDiscussionPost = ({ history }) => {
    // AUTH
    const auth = isAuthenticated();
    const userId = auth ? auth.user._id : null;
    const token = auth ? auth.token : null;

    // state for question
    const [question, setQuestion] = useState("");
    // state for correctAnswer
    const [correctAnswer, setCorrectAnswer] = useState("");
    // state for answer1
    const [answer1, setAnswer1] = useState("");
    // state for answer2
    const [answer2, setAnswer2] = useState("");
    // state for answer3
    const [answer3, setAnswer3] = useState("");
    // state for answer4
    const [answer4, setAnswer4] = useState("");
    // state for subject
    const [subject, setSubject] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !token) {
            setError("You must be logged in to create a discussion post.");
            return;
        }

        const discussionPost = {
            question,
            correctAnswer,
            answer1,
            answer2,
            answer3,
            answer4,
            subject,
        };

        try {
            const data = await createDiscussionPost(userId, token, discussionPost);
            if (data.error) {
                setError(data.error);
            } else {
                setSuccess(true);
                // Reset form fields after success
                setQuestion("");
                setCorrectAnswer("");
                setAnswer1("");
                setAnswer2("");
                setAnswer3("");
                setAnswer4("");
                setSubject("");

                // Redirect to home after a short delay
                setTimeout(() => {
                    history.push('/'); // Redirect to home using history
                }, 1000);
            }
        } catch (err) {
            console.log(err);
            setError("An error occurred while creating the discussion post.");
        }
    };

    if (!auth) {
        return <p style={{ textAlign: 'center' }}>You must be logged in to create a discussion post.</p>;
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Question */}
                <div style={styles.inputContainer}>
                    <i className="fa fa-question" aria-hidden="true" style={styles.icon}></i>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        style={styles.input}
                        rows={3}
                    />
                </div>

                {/* Question */}
                <div style={styles.inputContainer}>
                    <i className="fa fa-book" aria-hidden="true" style={styles.icon}></i>
                    <textarea
                        value={question}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter your subject"
                        style={styles.input}
                        rows={3}
                    />
                </div>

                {/* CorrectAnswer */}
                <div style={styles.inputContainer}>
                    <i className="fa fa-check" aria-hidden="true" style={styles.icon}></i>
                    <textarea
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder="Enter the correct answer"
                        style={styles.input}
                        rows={3}
                    />
                </div>

                {/* Answer1 */}
                <div style={styles.inputContainer}>
                    <textarea
                        value={answer1}
                        onChange={(e) => setAnswer1(e.target.value)}
                        placeholder="Enter answer option 1"
                        style={styles.input}
                        rows={2}
                    />
                </div>

                {/* Answer2 */}
                <div style={styles.inputContainer}>
                    <textarea
                        value={answer2}
                        onChange={(e) => setAnswer2(e.target.value)}
                        placeholder="Enter answer option 2"
                        style={styles.input}
                        rows={2}
                    />
                </div>

                {/* Answer3 */}
                <div style={styles.inputContainer}>
                    <textarea
                        value={answer3}
                        onChange={(e) => setAnswer3(e.target.value)}
                        placeholder="Enter answer option 3"
                        style={styles.input}
                        rows={2}
                    />
                </div>

                {/* Answer4 */}
                <div style={styles.inputContainer}>
                    <textarea
                        value={answer4}
                        onChange={(e) => setAnswer4(e.target.value)}
                        placeholder="Enter answer option 4"
                        style={styles.input}
                        rows={2}
                    />
                </div>

                {/* Create Discussion Button */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        borderRadius: "20px",
                        height: "3rem",
                        backgroundColor: "#D19616"
                    }}
                    className="btn btn-raised btn-primary"
                >
                    Create Discussion
                </button>
            </form>

            {/* error */}
            {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}

            {/* success */}
            {success && (
                <div style={styles.message}>
                    <p className="alert alert-success text-center">Discussion post created successfully!</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '100%',
        margin: '0px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
    },
    icon: {
        marginRight: '10px',
        fontSize: '20px',
        color: '#3897f0',
    },
    input: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    message: {
        textAlign: 'center',
        marginTop: '10px',
    },
    link: {
        display: 'inline-block',
        marginTop: '10px',
        color: '#D19616',
        textDecoration: 'underline',
    },
};

// Wrap the component with withRouter
export default withRouter(NewDiscussionPost);
