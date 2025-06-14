class GamificationManager {
    constructor() {
        this.classes = {
            'productivity-warrior': {
                name: 'Productivity Warrior',
                level: 15,
                xp: 2847,
                maxXp: 3200,
                icon: '⚔️',
                color: '#10b981'
            },
            'health-mage': {
                name: 'Health Mage',
                level: 12,
                xp: 1856,
                maxXp: 2400,
                icon: '🔮',
                color: '#ec4899'
            },
            'social-diplomat': {
                name: 'Social Diplomat',
                level: 8,
                xp: 1456,
                maxXp: 1800,
                icon: '🤝',
                color: '#06b6d4'
            }
        };

        this.achievements = {
            'health-guardian': { unlocked: true, name: 'Health Guardian', desc: '7 days perfect health metrics', icon: '🛡️' },
            'focus-master': { unlocked: true, name: 'Focus Master', desc: '3+ hours deep work daily', icon: '🎯' },
            'social-butterfly': { unlocked: true, name: 'Social Butterfly', desc: 'Excellent social connections', icon: '🦋' },
            'biometric-master': { unlocked: true, name: 'Biometric Master', desc: '1000+ biometric data points', icon: '📱' },
            'quantum-pioneer': { unlocked: true, name: 'Quantum Pioneer', desc: 'First to use quantum optimization', icon: '⚛️' },
            'vital-signs-guru': { unlocked: false, name: 'Vital Signs Guru', desc: 'Perfect week of health metrics', icon: '⌚' },
            'life-optimizer': { unlocked: false, name: 'Life Optimizer', desc: 'Level 20 in all classes', icon: '👑' }
        };

        this.streaks = {
            meditation: { days: 7, active: true, multiplier: 2.0, bonus: 'Focus' },
            exercise: { days: 12, active: true, multiplier: 1.5, bonus: 'Energy' },
            reading: { days: 4, active: true, multiplier: 1.2, bonus: 'Learning' }
        };

        this.totalXp = 8534;
        this.init();
    }

    init() {
        this.updateDisplay();
        console.log('🎮 Gamification Manager initialized');
    }

    addXp(className, amount, reason = '') {
        if (this.classes[className]) {
            const originalXp = this.classes[className].xp;
            this.classes[className].xp += amount;
            this.totalXp += amount;

            // Check for level up
            if (this.classes[className].xp >= this.classes[className].maxXp) {
                this.levelUp(className);
            }

            this.updateDisplay();
            
            const reasonText = reason ? ` (${reason})` : '';
            notificationManager?.showNotification(
                `🎮 +${amount} XP earned${reasonText}`, 
                'success'
            );
        }
    }

    levelUp(className) {
        this.classes[className].level++;
        this.classes[className].xp = 0;
        this.classes[className].maxXp = Math.floor(this.classes[className].maxXp * 1.2);

        notificationManager?.showNotification(
            `🎉 ${this.classes[className].name} leveled up to ${this.classes[className].level}!`, 
            'success'
        );

        this.checkAchievements();
    }

    checkAchievements() {
        // Check for life optimizer achievement
        const allLevel20 = Object.values(this.classes).every(c => c.level >= 20);
        if (allLevel20 && !this.achievements['life-optimizer'].unlocked) {
            this.unlockAchievement('life-optimizer');
        }

        // Check for biometric master based on data points
        if (biometricManager?.history?.length > 1000 && !this.achievements['biometric-master'].unlocked) {
            this.unlockAchievement('biometric-master');
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
            this.achievements[achievementId].unlocked = true;
            
            notificationManager?.showNotification(
                `🏆 Achievement Unlocked: ${this.achievements[achievementId].name}!`, 
                'success'
            );

            this.updateDisplay();
        }
    }

    updateStreak(activity, completed = true) {
        if (this.streaks[activity]) {
            if (completed) {
                this.streaks[activity].days++;
                this.streaks[activity].active = true;
                
                // Update multiplier based on streak length
                if (this.streaks[activity].days >= 30) {
                    this.streaks[activity].multiplier = 3.0;
                } else if (this.streaks[activity].days >= 14) {
                    this.streaks[activity].multiplier = 2.5;
                } else if (this.streaks[activity].days >= 7) {
                    this.streaks[activity].multiplier = 2.0;
                }

                notificationManager?.showNotification(
                    `🔥 ${activity} streak: ${this.streaks[activity].days} days! ${this.streaks[activity].multiplier}x ${this.streaks[activity].bonus} bonus active!`, 
                    'success'
                );
            } else {
                this.streaks[activity].days = 0;
                this.streaks[activity].active = false;
                this.streaks[activity].multiplier = 1.0;
                
                notificationManager?.showNotification(
                    `💔 ${activity} streak broken`, 
                    'warning'
                );
            }

            this.updateDisplay();
        }
    }

    updateDisplay() {
        // Update class displays
        Object.entries(this.classes).forEach(([key, classData]) => {
            const percentage = (classData.xp / classData.maxXp) * 100;
            
            const elements = {
                [`${key}-level`]: `Level ${classData.level}`,
                [`${key}-xp`]: `${classData.xp}/${classData.maxXp} XP`,
                [`${key}-progress`]: percentage
            };

            Object.entries(elements).forEach(([id, value]) => {
                if (id.includes('progress')) {
                    const progressBar = document.querySelector(`[data-class="${key}"] .xp-progress`);
                    if (progressBar) {
                        progressBar.style.width = `${value}%`;
                    }
                } else {
                    uiManager?.updateElement(id, value);
                }
            });
        });

        // Update achievement displays
        Object.entries(this.achievements).forEach(([key, achievement]) => {
            const element = document.querySelector(`[data-achievement="${key}"]`);
            if (element) {
                element.classList.toggle('unlocked', achievement.unlocked);
                element.classList.toggle('locked', !achievement.unlocked);
            }
        });

        // Update streak displays
        Object.entries(this.streaks).forEach(([key, streak]) => {
            const element = document.querySelector(`[data-streak="${key}"]`);
            if (element) {
                element.classList.toggle('active-streak', streak.active);
                const daysElement = element.querySelector('.streak-days');
                const multiplierElement = element.querySelector('.streak-multiplier');
                
                if (daysElement) daysElement.textContent = `${streak.days} days`;
                if (multiplierElement) {
                    multiplierElement.textContent = `${streak.multiplier}x ${streak.bonus} Bonus Active!`;
                    multiplierElement.style.display = streak.active ? 'inline-block' : 'none';
                }
            }
        });

        // Update total XP
        uiManager?.updateElement('totalXp', this.totalXp.toString());
    }

    getStats() {
        return {
            totalXp: this.totalXp,
            unlockedAchievements: Object.values(this.achievements).filter(a => a.unlocked).length,
            totalAchievements: Object.keys(this.achievements).length,
            activeStreaks: Object.values(this.streaks).filter(s => s.active).length,
            highestLevel: Math.max(...Object.values(this.classes).map(c => c.level))
        };
    }

    triggerLearningActivity() {
        this.addXp('social-diplomat', 30, 'Learning activity completed');
    }

    completeMorningRitual() {
        this.addXp('health-mage', 15, 'Morning meditation');
        this.updateStreak('meditation', true);
    }

    completeWorkout() {
        this.addXp('health-mage', 25, 'Workout completed');
        this.updateStreak('exercise', true);
    }
}

// Export for global access
window.gamificationManager = new GamificationManager();