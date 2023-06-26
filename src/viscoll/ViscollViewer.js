import { Fragment, useState } from 'react'
import _ from 'underscore';

import './style.css';

function TermInfo(props) {
	const [expanded, setExpanded] = useState(false);

	return <div>
		<a className="title" title={props.info} _onClick={() => setExpanded(!expanded)}>{props.title} <span style={{display: 'none'}}>{expanded ? '▲' : '▼'}</span></a>
		{
			expanded && <div style={{marginBottom: 15}}>
				<small>{props.info}</small>
			</div>
		}
	</div>
}

function Group(props) {
	const leafHeight = 35;
	const joinIndentWidth = 25;

	const topPadding = 20;
	const bottomPadding = 20;
	const borderWidth = 10;

	let joinedLeafs = [];

	let joinIndent = 0;
	let joinIndents = [0];

	let firstLeafId = parseInt(props.data.memberOrders[0].split('_')[1])

	return <div className="viscoll-group">
		<div className="group-title">
			{
				props.data.params.type+' '+props.group
			}
		</div>

		<div className="members" style={{
			height: leafHeight*props.data.memberOrders.length+topPadding+bottomPadding
		}}>

			{
				props.data.memberOrders.map((member, memberIndex) => {
					let leafId = parseInt(member.split('_')[1]);
					let leafObj = props.leafs[leafId];

					let leafTerms = _.filter(props.terms, (term) => term.objects.Leaf.indexOf(leafId) > -1);

					let repaired = _.find(leafTerms, (term) => term.params.title === 'repaired bifolium') !== undefined;

					let leafRecto = props.rectos[leafObj.rectoOrder];
					let leafVerso = props.versos[leafObj.versoOrder];

					let rectoTerms = _.filter(props.terms, (term) => term.objects.Recto.indexOf(leafObj.rectoOrder) > -1);
					let versoTerms = _.filter(props.terms, (term) => term.objects.Verso.indexOf(leafObj.versoOrder) > -1);

					let isJoined = leafObj.conjoined_leaf_order > 0;

					if (isJoined && leafObj.conjoined_leaf_order < leafId) {
						isJoined = false;
					}

					if ((isJoined && joinedLeafs.indexOf(leafObj.conjoined_leaf_order) > -1) || leafObj.conjoined_leaf_order < leafId) {
						if (leafObj.conjoined_leaf_order < leafId && leafObj.conjoined_leaf_order !== null) {
							joinIndent -= 1;
						}

						if (joinIndent < 1) {

							joinIndent -= 1;
						}

					}
					else {
						joinIndent += 1;						
					}

					joinIndent = joinIndent < 0 ? 0 : joinIndent;

					joinIndents.push(joinIndent);

					let leafStyle = {
						top: leafHeight*memberIndex,
						height: leafHeight,
					};

					return <Fragment key={memberIndex}>
						<div className={'leaf'+(leafTerms.length > 0 || rectoTerms.length > 0 || versoTerms.length > 0 ? ' hoverable' : '')} style={leafStyle}>
							
							<div className={'line'+(leafObj.params.stub === 'Yes' ? ' stub' : '')+
								(leafObj.params.type == 'Added' ? ' added' : '')+
								(leafObj.params.type == 'Endleaf' ? ' endleaf' : '')+
								(leafObj.params.type == 'Replaced' ? ' replaced' : '')
							} style={{
									top: leafHeight/2
								}}>

								{
									(leafObj.params.attached_below == 'Pasted') && <div style={{
										left: joinIndentWidth*(joinIndent)
									}} className={'pasted below'} />
								}
								{
									/*
									(leafObj.params.attached_below == 'Pasted' || leafObj.params.attached_below == 'Tipped') && <div style={{
										left: leafHeight*(joinIndent)
									}} className={'pasted below'+(leafObj.params.attached_above == 'Tipped' ? ' tipped' : '')} />
									*/
								}
								{
									(leafTerms.length > 0 || rectoTerms.length > 0 || versoTerms.length > 0) && <>
										<div className="terms-symbol" />
										<div className="terms">
										{
												leafTerms.map((term, termIndex) => <TermInfo key={termIndex} 
													title={'L'+leafId+': '+term.params.title} 
													info={term.params.description} 
												/>)
											}
											{
												leafTerms.length > 0 && (rectoTerms.length > 0 || versoTerms.length > 0) && 
												<br/>
											}
											{
												rectoTerms.map((term, termIndex) => <TermInfo key={termIndex} 
												title={'Recto'+leafId+': '+term.params.title} 
												info={term.params.description} 
											/>)
											}
											{
												versoTerms.map((term, termIndex) => <TermInfo key={termIndex} 
												title={'Verso'+leafId+': '+term.params.title} 
												info={term.params.description} 
											/>)
											}
										</div>
									</>
								}
							</div>

							<div className="folio-number">
								{
									'L'+leafId
								}
								{
									leafObj.params.stub !== 'Yes' && <div className="recto-verso">
										{
											leafRecto && <div>{leafRecto.params.page_number ? leafRecto.params.page_number : leafObj.params.folio_number+'r'}</div>
										}
										{
											leafVerso && <div>{leafVerso.params.page_number ? leafVerso.params.page_number : leafObj.params.folio_number+'v'}</div>
										}
									</div>
								}
							</div>

						</div>

						{
							isJoined && <div className={'join'+(leafObj.params.type == 'Added' ? ' added' : '')+
								(leafObj.params.type == 'Endleaf' ? ' endleaf' : '')+
								(leafObj.params.type == 'Replaced' ? ' replaced' : '')+
								(repaired ? ' dashed' : '')
							} 
							style={{
								top: (leafHeight*(memberIndex))+(leafHeight/2)-borderWidth,
								left: joinIndentWidth*(joinIndent-1),
								width: joinIndentWidth,
								height: leafHeight*(leafObj.conjoined_leaf_order-leafId)+(borderWidth*2)
							}}>
								<div className="join-line" style={{
									borderTopLeftRadius: leafHeight,
									borderBottomLeftRadius: leafHeight									
								}} />
							</div>
						}

					</Fragment>
				})
			}

			{
				props.data.sewing && props.data.sewing.length == 2 && <div className="sewing" style={{
					//top: props.leafs[props.data.sewing[0]].conjoined_leaf_order == props.data.sewing[1] && true == false ? (firstLeafId-(props.data.sewing[0]-props.data.sewing[1]))*leafHeight : (props.data.sewing[1]-firstLeafId)*leafHeight,
					top: (props.data.sewing[1]-firstLeafId)*leafHeight,
					width: (Math.max(...joinIndents))*joinIndentWidth
				}} />
			}

		</div>
	</div>
}

function ViscollViewer(props) {
	return <div className="viscoll">
		<h1>{props.data.project.title}</h1>
		{
			Object.keys(props.data.Groups).map((group, groupIndex) => {
					return <Group key={groupIndex} 
						group={group}
						leafs={props.data.Leafs} 
						terms={props.data.Terms} 
						rectos={props.data.Rectos} 
						versos={props.data.Versos} 
						data={props.data.Groups[group]} />
				})
			}
	</div>
}

export default ViscollViewer;