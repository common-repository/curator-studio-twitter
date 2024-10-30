import Config from '../config';

const createSource = (edge, extra={}) => {
	const limit = Config.source.limit[ edge ] || Config.source.limit.any;
	return {static: false, source: 'twitter', edge, entity: '', limit, exclude: null, ...extra};
};

const createSearchSource = edge => {
	return {...createSource(edge), from: null, to: null, result_type: 'recent', lat:null, long: null, radius: null};
};

const Fields = {
	entity({label, tip=null, masks=null}, edge){
		return [
			{
				tag: 'EntityInput',
				component: 'Input',
				classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
				config: {
					path: 'entity',
					type: 'text',
					label,
					tip: edge.includes('--') ? {
						content: 'Please see <a href="https://curatorstudio.io/docs/dynamic-entities/" target="_blank">this article</a>'
					} : tip,
					masks,
					validations: edge.includes('search') && !edge.includes('--') ? [] : [{n:'onlyspace', not: true, msg:'Cannot be empty'}]
				}
			}
		];
	},
	static: [
		{
			tag: 'SwitchInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none', 'flex-column'],
			config: {
				path: 'static',
				label: 'Pinned',
				tip: 'Items from pinned source will always show before others',
				options: [
					{value: false, label: ''},
					{value: true, label: ''}
				]
			}
		}
	],
	include_exclue_types: [
		{
			tag: 'SwitchInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none', 'flex-column'],
			config: {
				path: 'include_replies',
				label: 'Include Replies',
				tip: 'Include tweets that were replies',
				options: [
					{value: false, label: ''},
					{value: true, label: ''}
				]
			}
		},
		{
			tag: 'SwitchInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none', 'flex-column'],
			config: {
				path: 'include_rts',
				label: 'Include Retweets',
				tip: 'Include tweets that were retweets',
				options: [
					{value: false, label: ''},
					{value: true, label: ''}
				]
			}
		}
	],
	date_range: [	
		{
			tag: 'DateInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'from',
				label: 'From',
				type: 'date',
				validations: []
			}
		},
		{
			tag: 'DateInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'to',
				label: 'To',
				type: 'date',
				validations: []
			}
		}
	],
	limit(schema){
		const limit = Config.source.limit[ schema.edge ] || Config.source.limit.any;
		return [
			{
				tag: 'TextInput',
				component: 'Input',
				classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
				config: {
					path: 'limit',
					label: 'Limit (API)',
					type: 'number',
					tip: 'How many items to fetch from this source\'s API at a time',
					attrs: {
						min: 1,
						max: limit
					},
					validations:[
						{n: 'min', v:1, msg: 'Must be at least 1'},
						{n: 'max', v:limit, msg: `Cannot be more than ${limit}`}
					]
				}
			}
		];
	},
	exclude: [
		{
			tag: 'TextInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'exclude',
				label: 'Exclude words',
				type: 'text',
				tip: 'Exclude items containing these words. Separate multiple words by commas.'
			}
		}
	],
	result_type: [
		{
			tag: 'SelectInput',
			component: 'Input',
			classes: ['col'],
			config: {
				path: 'result_type',
				label: 'Result Type',
				config: {
					allow_empty: false,
					select_key: 'value',
					multiple: false
				},
				options: [
					{value: 'mixed', label: 'Mixed'}, 
					{value: 'recent', label: 'Recent'},
					{value: 'popular', label: 'Popular'}
				]
			}
		}
	],
	geocode: [
		{
			tag: 'TextInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'lat',
				label: 'Latitude',
				type: 'text',
				validations:[]
			}
		},
		{
			tag: 'TextInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'long',
				label: 'Longitude',
				type: 'text',
				validations:[]
			}
		},
		{
			tag: 'TextInput',
			component: 'Input',
			classes: ['d-flex', 'ai-center', 'col', 'flex-none'],
			config: {
				path: 'radius',
				label: 'Radius in km',
				type: 'number',
				validations:[]
			}
		}
	]
};

const expansions = (e, extras) => {
	return extras.map(x => [`${e}${x[0]}`, x.slice(1)]);
};

const getFields = (fields, edge) => {
	return fields.map(f => {
		return typeof Fields[f] === 'function' ? Fields[f](edge) : Fields[f];
	});
};

const expandPaths = (paths, extras) => {
	const ps = [];
	for(const p of paths){
		const {title, fields, schema, ...rest} = p;
		const e = fields.edge;
				
		for(const [edge, [suffix, label]] of [[e, ['', schema.label]], ...expansions(e, extras)]){
			const schema_fields = schema.fields || [[]];
			ps.push(
				{
					title: title + suffix,
					fields: {
						...fields,
						edge
					},
					...rest,
					schema: [
						Fields.entity({...schema, label}, edge).concat(
							...getFields(schema_fields[0], {...fields, edge})
						),
						...( schema_fields[1] ? [[].concat(...getFields(schema_fields[1], {...fields, edge}))] : [] )
					]
				}
			);
		}
	}
	return ps;
};

export {expandPaths, createSource, createSearchSource};
