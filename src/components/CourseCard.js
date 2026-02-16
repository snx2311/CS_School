import React from 'react';

const CourseCard = ({ title, icon, description, level }) => {
  return (
    <div style={styles.card}>
      <div style={styles.iconContainer}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.level}>{level}</p>
      <p style={styles.cardText}>{description}</p>
      <button style={styles.btn}>Enroll Now</button>
    </div>
  );
};

const styles = {
  card: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    flex: '1 1 250px',
    maxWidth: '300px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px -15px rgba(2,12,27,0.7)',
    margin: '10px'
  },
  iconContainer: {
    fontSize: '50px',
    marginBottom: '15px',
    display: 'block'
  },
  cardTitle: {
    color: '#00ff41',
    fontSize: '20px',
    marginBottom: '5px'
  },
  level: {
    color: '#64ffda',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '15px'
  },
  cardText: {
    color: '#8892b0',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px',
    height: '60px'
  },
  btn: {
    background: 'transparent',
    border: '1px solid #00ff41',
    color: '#00ff41',
    padding: '10px 25px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s'
  }
};

export default CourseCard;