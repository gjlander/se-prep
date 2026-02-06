import type { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/context';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

type PostCardProps = {
	id: string;
	content: string;
	image: string;
	title: string;
	author: string;
	setPosts: Dispatch<SetStateAction<Post[]>>;
};

const PostCard = ({
	id,
	content,
	image,
	title,
	author,
	setPosts
}: PostCardProps) => {
	const { user } = useAuth();
	// console.log(author);
	return (
		<div className='card bg-base-100 shadow-xl'>
			<figure className='bg-white h-48'>
				<img src={image} alt={title} className='object-cover h-full w-full' />
			</figure>
			<div className='card-body h-56'>
				<h2 className='card-title'>{title}</h2>
				<p className='truncate text-wrap'>{content}</p>
				<Link to={`/post/${id}`} className='btn btn-primary mt-4'>
					Read More
				</Link>
				{user?.id === author && (
					<div className='card-actions justify-center gap-6'>
						<button
							onClick={() =>
								document
									.querySelector<HTMLDialogElement>(`#edit-modal-${id}`)!
									.showModal()
							}
							className='btn btn-success'
						>
							Edit
						</button>
						<EditModal
							id={id}
							image={image}
							title={title}
							content={content}
							author={author}
							setPosts={setPosts}
						/>

						<button
							onClick={() =>
								document
									.querySelector<HTMLDialogElement>(`#delete-modal-${id}`)!
									.showModal()
							}
							className='btn btn-error'
						>
							Delete
						</button>
						<DeleteModal id={id} setPosts={setPosts} />
					</div>
				)}
			</div>
		</div>
	);
};

export default PostCard;
