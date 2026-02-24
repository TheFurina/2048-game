const aiAnalysisVersion = '2.0';
window.aiAnalysisVersion = aiAnalysisVersion;
function setupAiAnalysis() {
    const aiAnalysisButton = document.getElementById('ai-analysis-button');
    if (!aiAnalysisButton) return;
    aiAnalysisButton.addEventListener('click', analyzeGameState);
    const closeAiModalButton = document.getElementById('close-ai-modal');
    if (closeAiModalButton) {
        closeAiModalButton.addEventListener('click', function() {
            document.getElementById('ai-analysis-modal').classList.add('hidden');
        });
    }
    const aiAnalysisModal = document.getElementById('ai-analysis-modal');
    if (aiAnalysisModal) {
        aiAnalysisModal.addEventListener('click', function(e) {
            if (e.target === aiAnalysisModal) {
                aiAnalysisModal.classList.add('hidden');
            }
        });
    }
    const toggleBestMoveButton = document.getElementById('toggle-best-move');
    if (toggleBestMoveButton) {
        const bestMoveText = document.querySelector('#best-move-direction .best-move-text');
        const icon = toggleBestMoveButton.querySelector('i');
        if (bestMoveText && icon) {
            const isBestMoveHidden = localStorage.getItem('bestMoveHidden') === 'true';
            if (isBestMoveHidden) {
                bestMoveText.classList.add('blur-sm');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                toggleBestMoveButton.title = '显示最佳移动方向';
            } else {
                bestMoveText.classList.remove('blur-sm');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                toggleBestMoveButton.title = '隐藏最佳移动方向';
            }
            toggleBestMoveButton.addEventListener('click', function() {
                if (bestMoveText.classList.contains('blur-sm')) {
                    bestMoveText.classList.remove('blur-sm');
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    this.title = '隐藏最佳移动方向';
                    localStorage.setItem('bestMoveHidden', 'false');
                } else {
                    bestMoveText.classList.add('blur-sm');
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    this.title = '显示最佳移动方向';
                    localStorage.setItem('bestMoveHidden', 'true');
                }
            });
        }
    }
}
function analyzeGameState() {
    const modal = document.getElementById('ai-analysis-modal');
    const overlay = document.getElementById('ai-analysis-overlay');
    overlay.classList.add('hidden');
    const directions = ['up', 'down', 'left', 'right'];
    const directionNames = {
        up: '向上', 
        down: '向下', 
        left: '向左', 
        right: '向右'
    };
    let bestScore = -1;
    let bestDirection = 'up';
    let mergeOpportunities = 0;
    const gridCopy = JSON.parse(JSON.stringify(gameState.grid));
    const originalScore = gameState.score;
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const gridSize = Math.max(gridRows, gridCols);
    let scoreDiffWeight, emptyCellsWeight, mergesWeight, positionWeight, maxValueWeight, continuityWeight, uniformityWeight, blockWeight, multiStepWeight, monotonicityWeight;
    let dangerThreshold, warningThreshold;
    let highPotentialThreshold, mediumPotentialThreshold;
    let directionPriority = {up: 1, down: 1, left: 1, right: 1};
    scoreDiffWeight = Math.min(0.3, 0.2 + (gridSize - 3) * 0.05);
    emptyCellsWeight = Math.max(0.1, 0.18 - (gridSize - 3) * 0.03);
    mergesWeight = Math.max(0.1, 0.15 - (gridSize - 3) * 0.015);
    positionWeight = 0.1;
    maxValueWeight = 0.1;
    continuityWeight = 0.05;
    uniformityWeight = 0.05;
    blockWeight = 0.05;
    multiStepWeight = 0.1;
    monotonicityWeight = Math.max(0, 0.02 - (gridSize - 3) * 0.005);
    directionPriority = {up: 1.1, down: 0.9, left: 1, right: 1};
    dangerThreshold = Math.max(1, Math.floor(gridSize * 0.67));
    warningThreshold = Math.max(2, Math.floor(gridSize * 1.33));
    highPotentialThreshold = Math.max(2, Math.floor(gridSize * 0.67));
    mediumPotentialThreshold = Math.max(1, Math.floor(gridSize * 0.33));
    directions.forEach(direction => {
        const tempGameState = {
            grid: JSON.parse(JSON.stringify(gridCopy)),
            score: originalScore,
            gridSize: gridSize,
            gridRows: gridRows,
            gridCols: gridCols
        };
        const moveResult = simulateMove(tempGameState, direction);
        if (moveResult.moved) {
            const scoreDiff = moveResult.score - originalScore;
            const emptyCells = countEmptyCells(tempGameState.grid);
            const merges = moveResult.merges;
            const positionScore = calculatePositionScore(tempGameState.grid);
            const maxValueScore = calculateMaxValueScore(tempGameState.grid);
            const continuityScore = calculateContinuityScore(tempGameState.grid);
            const uniformityScore = calculateUniformityScore(tempGameState.grid);
            const blockScore = calculateBlockScore(tempGameState.grid);
            const multiStepScore = calculateMultiStepScore(tempGameState.grid, direction);
            const monotonicityScore = calculateMonotonicityScore(tempGameState.grid);
            let totalScore = (
                scoreDiff * scoreDiffWeight +
                emptyCells * emptyCellsWeight +
                merges * mergesWeight +
                positionScore * positionWeight +
                maxValueScore * maxValueWeight +
                continuityScore * continuityWeight +
                uniformityScore * uniformityWeight +
                blockScore * blockWeight +
                multiStepScore * multiStepWeight +
                monotonicityScore * monotonicityWeight
            ) * directionPriority[direction];
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestDirection = direction;
            }
            mergeOpportunities += merges;
        }
    });
    document.getElementById('best-move-direction').innerHTML = `<span class="best-move-text">${directionNames[bestDirection]}</span>`;
    document.getElementById('merge-opportunities').textContent = mergeOpportunities > 0 ? mergeOpportunities : '无';
    const assessment = evaluateGameState(gameState, dangerThreshold, warningThreshold);
    document.getElementById('game-state-assessment').textContent = assessment;
    const potential = assessScorePotential(gameState, highPotentialThreshold, mediumPotentialThreshold);
    document.getElementById('score-potential').textContent = potential;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100', 'scale-100');
        modal.classList.remove('opacity-0', 'scale-95');
    }, 10);
}
function simulateMove(gameState, direction) {
    let moved = false;
    let score = gameState.score;
    let merges = 0;
    const grid = gameState.grid;
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const originalGrid = JSON.parse(JSON.stringify(grid));
    if (direction === 'left') {
        for (let row = 0; row < gridRows; row++) {
            const result = mergeRowLeft(grid[row]);
            grid[row] = result.row;
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'right') {
        for (let row = 0; row < gridRows; row++) {
            grid[row].reverse();
            const result = mergeRowLeft(grid[row]);
            grid[row] = result.row.reverse();
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'up') {
        for (let col = 0; col < gridCols; col++) {
            const column = [];
            for (let row = 0; row < gridRows; row++) {
                column.push(grid[row][col]);
            }
            const result = mergeRowLeft(column);
            for (let row = 0; row < gridRows; row++) {
                grid[row][col] = result.row[row];
            }
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'down') {
        for (let col = 0; col < gridCols; col++) {
            const column = [];
            for (let row = 0; row < gridRows; row++) {
                column.push(grid[row][col]);
            }
            column.reverse();
            const result = mergeRowLeft(column);
            const mergedColumn = result.row.reverse();
            for (let row = 0; row < gridRows; row++) {
                grid[row][col] = mergedColumn[row];
            }
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    }
    return { moved, score, merges };
}
function mergeRowLeft(row) {
    let newRow = row.filter(cell => cell !== 0 && cell !== null);
    let score = 0;
    let merges = 0;
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            merges++;
            newRow.splice(i + 1, 1);
            newRow.push(0);
        }
    }
    while (newRow.length < row.length) {
        newRow.push(0);
    }
    const moved = JSON.stringify(row) !== JSON.stringify(newRow);
    return { row: newRow, score, merges, moved };
}
function countEmptyCells(grid) {
    let count = 0;
    for (let row of grid) {
        for (let cell of row) {
            if (cell === 0 || cell === null) count++;
        }
    }
    return count;
}
function calculatePositionScore(grid) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    let score = 0;
    const weights = [];
    for (let i = 0; i < gridRows; i++) {
        weights[i] = [];
        for (let j = 0; j < gridCols; j++) {
            weights[i][j] = Math.pow(2, (gridRows - i - 1) + (gridCols - j - 1));
        }
    }
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            if (grid[i][j] !== 0 && grid[i][j] !== null) {
                score += grid[i][j] * weights[i][j];
            }
        }
    }
    return score;
}
function calculateMaxValueScore(grid) {
    let maxValue = 0;
    for (let row of grid) {
        for (let cell of row) {
            if (cell !== 0 && cell !== null && cell > maxValue) maxValue = cell;
        }
    }
    return maxValue;
}
function calculateContinuityScore(grid) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    let score = 0;
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols - 1; j++) {
            if (grid[i][j] !== 0 && grid[i][j] !== null && grid[i][j + 1] !== 0 && grid[i][j + 1] !== null) {
                const ratio = Math.min(grid[i][j], grid[i][j + 1]) / Math.max(grid[i][j], grid[i][j + 1]);
                score += ratio;
            }
        }
    }
    for (let j = 0; j < gridCols; j++) {
        for (let i = 0; i < gridRows - 1; i++) {
            if (grid[i][j] !== 0 && grid[i][j] !== null && grid[i + 1][j] !== 0 && grid[i + 1][j] !== null) {
                const ratio = Math.min(grid[i][j], grid[i + 1][j]) / Math.max(grid[i][j], grid[i + 1][j]);
                score += ratio;
            }
        }
    }
    return score;
}
function calculateUniformityScore(grid) {
    const values = [];
    for (let row of grid) {
        for (let cell of row) {
            if (cell !== 0 && cell !== null) values.push(cell);
        }
    }
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const uniformity = 1 / (1 + Math.sqrt(variance));
    return uniformity;
}
function calculateBlockScore(grid) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    let blockScore = 0;
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            if (grid[i][j] !== 0 && grid[i][j] !== null) {
                let blocked = true;
                if (i > 0 && (grid[i - 1][j] === 0 || grid[i - 1][j] === null)) blocked = false;
                if (i < gridRows - 1 && (grid[i + 1][j] === 0 || grid[i + 1][j] === null)) blocked = false;
                if (j > 0 && (grid[i][j - 1] === 0 || grid[i][j - 1] === null)) blocked = false;
                if (j < gridCols - 1 && (grid[i][j + 1] === 0 || grid[i][j + 1] === null)) blocked = false;
                if (i > 0 && i < gridRows - 1 && grid[i - 1][j] === grid[i + 1][j] && grid[i - 1][j] !== 0 && grid[i - 1][j] !== null) blocked = false;
                if (j > 0 && j < gridCols - 1 && grid[i][j - 1] === grid[i][j + 1] && grid[i][j - 1] !== 0 && grid[i][j - 1] !== null) blocked = false;
                if (blocked) blockScore++;
            }
        }
    }
    return -blockScore;
}
function calculateMultiStepScore(grid, direction) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    const tempGameState = {
        grid: JSON.parse(JSON.stringify(grid)),
        score: 0,
        gridSize: Math.max(gridRows, gridCols),
        gridRows: gridRows,
        gridCols: gridCols
    };
    let multiStepScore = 0;
    let steps = 0;
    while (steps < 2) {
        const result = simulateMove(tempGameState, direction);
        if (!result.moved) break;
        multiStepScore += result.score;
        steps++;
    }
    return multiStepScore;
}
function calculateMonotonicityScore(grid) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    let monotonicity = 0;
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols - 1; j++) {
            if (grid[i][j] !== null && grid[i][j + 1] !== null && grid[i][j] <= grid[i][j + 1]) {
                monotonicity++;
            }
        }
    }
    for (let j = 0; j < gridCols; j++) {
        for (let i = 0; i < gridRows - 1; i++) {
            if (grid[i][j] !== null && grid[i + 1][j] !== null && grid[i][j] <= grid[i + 1][j]) {
                monotonicity++;
            }
        }
    }
    return monotonicity;
}
function evaluateGameState(gameState, dangerThreshold, warningThreshold) {
    const emptyCells = countEmptyCells(gameState.grid);
    if (emptyCells <= dangerThreshold) {
        return '危险';
    } else if (emptyCells <= warningThreshold) {
        return '警告';
    } else {
        return '安全';
    }
}
function assessScorePotential(gameState, highPotentialThreshold, mediumPotentialThreshold) {
    const emptyCells = countEmptyCells(gameState.grid);
    if (emptyCells >= highPotentialThreshold) {
        return '高';
    } else if (emptyCells >= mediumPotentialThreshold) {
        return '中';
    } else {
        return '低';
    }
}
if (typeof window !== 'undefined') {
    window.setupAiAnalysis = setupAiAnalysis;
    window.analyzeGameState = analyzeGameState;
}