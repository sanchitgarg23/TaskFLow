
import { useNavigate } from 'react-router-dom';
import TeamBoardCreation from '../components/TeamBoardCreation';
import { useBoards } from '../context/BoardContext';
import { useTeam } from '../context/TeamContext';

const TeamBoardCreationPage = () => {
  const navigate = useNavigate();
  const { createBoard } = useBoards();
  const { team } = useTeam();

  const handleBack = () => {
    navigate('/team');
  };

  const handleCreateBoard = async (name, template, assignedMembers) => {
    const newBoard = await createBoard(`[Team] ${name}`, template);
    navigate(`/board/${newBoard.id}`);
  };

  return (
    <TeamBoardCreation
      onBack={handleBack}
      onCreateBoard={handleCreateBoard}
      teamMembers={team.members}
    />
  );
};

export default TeamBoardCreationPage;
