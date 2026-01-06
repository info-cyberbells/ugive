import Card from "../models/card.model.js";
import { MonthlyStreak } from "../models/monthlyStreak.model.js";
import { StudentRewardProgress } from "../models/studentRewardProgress.model.js";

// Get Monday of the week
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Add days
function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

// Format UI label
function formatRange(start, end) {
    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

export const getStudentStreakAndRewards = async (req, res) => {
    try {
        const studentId = req.user.id;
        const today = new Date();

        const allCards = await Card.find({ sender: studentId }).sort({ createdAt: 1 });

        if (allCards.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    message: "No streak data yet."
                }
            });
        }

        const firstCardDate = allCards[0].createdAt;
        let weekStart = getMonday(firstCardDate);

        let lifetimeWeeks = [];

        while (weekStart <= today) {
            const weekEnd = addDays(weekStart, 6);
            lifetimeWeeks.push({
                weekStart,
                weekEnd,
                cardsSent: allCards.filter(c =>
                    c.createdAt >= weekStart && c.createdAt <= weekEnd
                ).length
            });
            weekStart = addDays(weekEnd, 1);
        }


        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        let streakStarted = false;


        for (let i = lifetimeWeeks.length - 1; i >= 0; i--) {
            const week = lifetimeWeeks[i];

            if (week.cardsSent > 0) {
                streakStarted = true;
                currentStreak++;
            } else {
                if (!streakStarted) {
                    continue;
                }
                break;
            }
        }


        for (let i = 0; i < lifetimeWeeks.length; i++) {
            if (lifetimeWeeks[i].cardsSent > 0) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        const thisWeekStart = getMonday(today);
        const thisWeekEnd = addDays(thisWeekStart, 6);
        const cardsSentThisWeek = allCards.filter(c =>
            c.createdAt >= thisWeekStart && c.createdAt <= thisWeekEnd
        ).length;


        const year = today.getFullYear();
        const month = today.getMonth();

        const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
        const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);

        let monthWeeks = [];
        let mStart = getMonday(monthStart);

        let totalCardsThisMonth = 0;

        while (mStart <= monthEnd) {
            let mEnd = addDays(mStart, 6);
            if (mEnd > monthEnd) mEnd = monthEnd;

            const cards = allCards.filter(c =>
                c.createdAt >= mStart && c.createdAt <= mEnd
            ).length;

            totalCardsThisMonth += cards;

            if (mStart <= today) {
                monthWeeks.push({
                    weekLabel: formatRange(mStart, mEnd),
                    weekStart: mStart,
                    weekEnd: mEnd,
                    cardsSent: cards,
                    streakEarned: cards > 0
                });
            }

            mStart = addDays(mEnd, 1);
        }

        const saved = await MonthlyStreak.findOneAndUpdate(
            { student: studentId, monthKey },
            {
                student: studentId,
                monthKey,
                monthLabel,
                currentStreak,
                bestStreak,
                totalCardsThisMonth,
                weeks: monthWeeks
            },
            { new: true, upsert: true }
        );

        const rewardsProgress = await StudentRewardProgress.find({ student: studentId })
            .populate("reward", "name rewardImage totalPoints rewardDescription");

        const rewardsUnlocked = rewardsProgress.filter(r =>
            r.completedPoints >= r.reward.totalPoints
        );

        const rewardsUsed = rewardsProgress.filter(r => r.claimed === true);


        return res.status(200).json({
            success: true,
            data: {
                monthly: saved,
                rewardsUnlocked: rewardsUnlocked.map(r => ({
                    rewardId: r.reward._id,
                    name: r.reward.name
                })),
                rewardsUsed: rewardsUsed.map(r => ({
                    rewardId: r.reward._id,
                    name: r.reward.name,
                    usedAt: r.claimedAt
                }))
            }
        });

    } catch (err) {
        console.error("Streak error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
